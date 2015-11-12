Recompose
-----

[![build status](https://img.shields.io/travis/acdlite/recompose/master.svg?style=flat-square)](https://travis-ci.org/acdlite/recompose)
[![coverage](https://img.shields.io/codecov/c/github/acdlite/recompose.svg?style=flat-square)](https://codecov.io/github/acdlite/recompose)
[![code climate](https://img.shields.io/codeclimate/github/acdlite/recompose.svg?style=flat-square)](https://codeclimate.com/github/acdlite/recompose)
[![npm version](https://img.shields.io/npm/v/recompose.svg?style=flat-square)](https://www.npmjs.com/package/recompose)
[![npm downloads](https://img.shields.io/npm/dm/recompose.svg?style=flat-square)](https://www.npmjs.com/package/recompose)

Recompose is a React utility belt for function components and higher-order components. Think of it like lodash for React.

```
npm install recompose --save
```

### Related modules

- [**recompose-relay**](https://github.com/acdlite/recompose/tree/master/src/packages/recompose-relay) — Recompose helpers for Relay
- [**rx-recompose**](https://github.com/acdlite/recompose/tree/master/src/packages/rx-recompose) — RxJS utilities for Recompose and React

## You can use Recompose to...

### ...lift state into functional wrappers

Helpers like `withState()` and `withReducer()` provide a nicer way to express state updates:

```js
const Counter = withState(
  'counter', 'setCounter', 0,
  ({ counter, setCounter }) => (
    <div>
      Count: {counter}
      <button onClick={() => setCounter(n => n + 1)}>Increment</button>
      <button onClick={() => setCounter(n => n - 1)}>Decrement</button>
    </div>
  )
)
```

Or with a Redux-style reducer:

```js
const counterReducer = (count, action) {
  switch (action.type)
  case INCREMENT:
    return count + 1
  case DECREMENT:
    return count - 1
  default:
    return count
}

const Counter = withReducer(
  'count', 'dispatch', counterReducer, 0
  ({ counter, dispatch }) => (
    <div>
      Count: {counter}
      <button onClick={() => dispatch({ type: INCREMENT })}>Increment</button>
      <button onClick={() => dispatch({ type: DECREMENT })}>Decrement</button>
    </div>
  )
)
```

### ...perform the most common React patterns

Helpers like `componentFromProp()` and `withContext()` encapsulate common React patterns into a simple functional interface:

```js
const Button = compose(
  defaultProps({ component: 'button' })
  componentFromProp('component')
)

<Button /> // renders <button>
<Button component={Link} /> // renders <Link />
```

```js
const provide = store => withContext(
  { store: PropTypes.object },
  () => { store }
  // We've left out final `BaseComponent` param
  // Because of currying, `provide` is a higher-order component
)

// Apply to base component
// Descendants of App have access to context.store
const AppWithContext = provide(App)
```

### ...optimize rendering performance

No need to write a new class just to implement `shouldComponentUpdate()`. Recompose helpers like `pure()` and `onlyUpdateForKeys()` do this for you:

```js
// A component that is expensive to render
const ExpensiveComponent = ({ propA, propB }) => {...}

// Optimized version of same component, using shallow comparison of props
// Same effect as React's PureRenderMixin
const OptimizedComponent = pure(ExpensiveComponent)

// Even more optimized: only updates if specific prop keys have changed
const HyperOptimizedComponent = onlyUpdateForKeys(['propA', 'propB'], ExpensiveComponent)
```

### ...interoperate with other libraries

Recompose helpers integrate really nicely with external libraries like Relay, Redux, and RxJS

```js
const Post = compose(
  // This is a curried version of createRelay provided by recompose-relay
  createContainer({
    fragments: {
      post: () => Relay.QL`
        fragment on Post {
          title,
          content
        }
      `
    }
  }),
  flattenProp('post'),
  ({ title, content }) => (
    <article>
      <h1>{title}</h1>
      <div>{content}</div>
    </article>
  )
)
```

### ...build your own libraries

Many React libraries end up implementing the same utilities over and over again, like `shallowEqual()` and `getDisplayName()`. Recompose provides these utilities for you.

```js
// Any Recompose module can be imported individually
import getDisplayName from 'recompose/getDisplayName'
ConnectedComponent.displayName = `connect(${getDisplayName(BaseComponent)})`

// Or, even better:
import wrapDisplayName from 'recompose/wrapDisplayName'
ConnectedComponent.displayName = wrapDisplayName(BaseComponent, 'connect')

import toClass from 'recompose/toClass'
// Converts a function component to a class component, e.g. so it can be given
// a ref. Returns class components as is.
const ClassComponent = toClass(FunctionComponent)
```

### ...and more

## Usage

All functions are available on the top-level export.

```js
import { compose, mapProps, withState /* ... */ } from 'recompose'
```

### Optimizing bundle size

You can reduce your bundle size by only including the modules that you need.

All top-level exports can be imported individually:

```js
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
// ... and so on
```

This is a good option for library authors who don't want to bloat their bundle sizes.

Recompose includes some lodash modules, like `curry` and `compose`, as dependencies. If you're already using lodash, then the net bundle increase from using Recompose will be even smaller.


## API docs

[Read them here](docs/API.md)

## Why

Forget ES6 classes vs. `createClass()`.

An idiomatic React application consists mostly of function components.

```js
const Greeting = props => (
  <p>
    Hello, {props.name}!
  </p>
);
```

Function components have several key advantages:

- They prevent abuse of the `setState()` API, favoring props instead.
- They're simpler, and less error-prone.
- They encourage the "smart" vs. "dumb" component pattern.
- They encourage code that is more reusable and modular.
- They discourage giant, complicated components that do too many things.
- In the future, they will allow React to make performance optimizations by avoiding unnecessary checks and memory allocations.

The practice of writing small, pure, reusable components is sometimes called **microcomponentization**.

(Note that although Recompose encourages the use of function components whenever possible, it works with normal React components as well.)

### Higher-order components made easy

Most of the time when we talk about composition in React, we're talking about composition of components. For example, a `<Blog>` component may be composed of many `<Post>` components, which are composed of many `<Comment>` components.

However, that's only the beginning. Recompose focuses on another unit of composition: **higher-order components** (HoCs). HoCs are functions that accept a base component and return a new component with additional functionality. They can be used to abstract common tasks into reusable pieces.

Recompose provides a toolkit of helper functions for creating higher-order components. Most of these helpers are themselves are higher-order components. You can compose the helpers together to make new HoCs, or apply them to a base component.

### Should I use this? Performance and other concerns

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

## Usage

All functions are available on the top-level export.

```js
import { compose, mapProps, withState /* ... */ } from 'recompose';
```

### Optimizing bundle size

You can reduce your bundle size by only including the modules that you need.

All top-level exports can be imported individually:

```js
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
// ... and so on
```

This is a good option for library authors who don't want to bloat their bundle sizes.

Recompose depends on certain lodash modules, like `curry` and `compose`. If you're already using lodash, then the net bundle increase from using Recompose will be even smaller.

## Features

### Automatic currying

Recompose functions are component-last and curried by default. This makes them easy to compose:

```js
const BaseComponent = props => {...};

// This will work, but it's tedious
let ContainerComponent = onWillReceiveProps(..., BaseComponent);
ContainerComponent = mapProps(..., ContainerComponent);
ContainerComponent = withState(..., ContainerComponent);

// Do this instead
// Note that the order has reversed — props flow from top to bottom
const ContainerComponent = compose(
  withState(...),
  mapProps(...),
  onWillReceiveProps(...)
)(BaseComponent);
```

Technically, this also means you can use them as decorators (if that's your thing):

```js
@withState(...)
@mapProps(...)
@onWillReceiveProps(...)
class Component extends React.Component {...}
```

### Helpful warnings in development

If you use the `compose()` method provided by Recompose, it will print a warning if a higher-order component helper has insufficient parameters. For example, if you forget to pass an initial state to `withReducer()`:

```js
compose(
  withReducer('state', 'dispatch', reducer), // Forgot initialState
  ...otherHelpers
)(BaseComponent)
```

> Attempted to compose `withReducer()` with other higher-order component helpers, but it has been applied with 1 too few parameters. Check the implementation of \<BaseComponent\>.

## Feedback wanted

Project is still in the early stages. Please file an issue or submit a PR if you have suggestions! Or ping me (Andrew Clark) on [Twitter](https://twitter.com/acdlite).
