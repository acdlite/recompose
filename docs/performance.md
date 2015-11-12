# Should I use this? Performance and other concerns

If function composition doesn't scare you, then yes, I think so. I believe using higher-order component helpers leads to smaller, more focused components, and provides a better programming model than using classes for operations—like `mapProps()` or `shouldUpdate()`—that aren't inherently class-y.

That being said, any abstraction over an existing API is going to come with trade-offs. There is a performance overhead when introducing a new component to the tree. I suspect this cost is negligible compared to the gains achieved by blocking subtrees from re-rendering using `shouldComponentUpdate()`—which Recompose makes easy with its `shouldUpdate()` and `onlyUpdateForKeys()` helpers. In the future, I'll work on some benchmarks so we know what we're dealing with.

However, many of Recompose's higher-order component helpers are implemented using stateless function components rather than class components. Eventually, React will include optimizations for stateless components. Until then, we can do our own optimizations by taking advantage of referential transparency. In other words, creating an element from a stateless function is effectively* the same as calling the function and returning its output.

\* *Stateless function components are not referentially transparent if they access context or use default props; we detect that by checking for the existence of `contextTypes` and `defaultProps`.*

To accomplish this, Recompose uses a special version of `createElement()` that returns the output of stateless functions instead of creating a new element. For class components, it uses the built-in `React.createElement()`.

I wouldn't recommend this approach for most of the stateless function components in your app. First of all, you lose the ability to use JSX, unless you monkey-patch `React.createElement()`, which is a bad idea. Second, you lose lazy evaluation. Consider the difference between these two components, given that `Comments` is a stateless function component:

```js
// With lazy evaluation
const Post = ({ title, content, comments, showComments }) => {
  const theComments = <Comments comments={comments} />;
  return (
    <article>
      <h1>title</h1>
      <div>{content}</div>
      {showComments ? theComments : null}
    </article>
  );
});

// Without lazy evaluation
const Post = ({ title, content, comments, showComments }) => {
  const theComments = Comments({ comments });
  return (
    <article>
      <h1>title</h1>
      <div>{content}</div>
      {showComments ? theComments : null}
    </article>
  );
});
```

In the first example, the `Comments` function is used to create a React element, and will only be evaluated *by React* if `showComments` is true. In the second example, the `Comments` function is evaluated on every render of `Post`, regardless of the value of `showComments`. This can be fixed by putting the `Comments` call inside the ternary statement, but it's easy to neglect this distinction and create performance problems. As a general rule, you should always create an element.

So why does Recompose break this rule? Because it's a utility library, not an application. Just as it's okay for lodash to use for-loops as an implementation detail of its helper functions, it should be okay for Recompose to eschew intermediate React elements as a (temporary) performance optimization.
