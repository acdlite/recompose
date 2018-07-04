Recompose
-----

[![build status](https://img.shields.io/travis/acdlite/recompose/master.svg?style=flat-square)](https://travis-ci.org/acdlite/recompose)
[![coverage](https://img.shields.io/codecov/c/github/acdlite/recompose.svg?style=flat-square)](https://codecov.io/github/acdlite/recompose)
[![code climate](https://img.shields.io/codeclimate/github/acdlite/recompose.svg?style=flat-square)](https://codeclimate.com/github/acdlite/recompose)
[![npm version](https://img.shields.io/npm/v/recompose.svg?style=flat-square)](https://www.npmjs.com/package/recompose)
[![npm downloads](https://img.shields.io/npm/dm/recompose.svg?style=flat-square)](https://www.npmjs.com/package/recompose)

Recompose is a React utility belt for function components and higher-order components. Think of it like lodash for React.

[**Full API documentation**](docs/API.md) - Learn about each helper

[**Recompose Base Fiddle**](https://jsfiddle.net/evenchange4/p3vsmrvo/1599/) - Easy way to dive in

```
npm install recompose --save
```

**📺 Watch Andrew's [talk on Recompose at React Europe](https://www.youtube.com/watch?v=zD_judE-bXk).**
*(Note: Performance optimizations he speaks about have been removed, more info [here](https://github.com/acdlite/recompose/releases/tag/v0.26.0))*

### Related modules

[**recompose-relay**](src/packages/recompose-relay) — Recompose helpers for Relay

## You can use Recompose to...

### ...lift state into functional wrappers

Helpers like `withState()` and `withReducer()` provide a nicer way to express state updates:

```js
const enhance = withState('counter', 'setCounter', 0)
const Counter = enhance(({ counter, setCounter }) =>
  <div>
    Count: {counter}
    <button onClick={() => setCounter(n => n + 1)}>Increment</button>
    <button onClick={() => setCounter(n => n - 1)}>Decrement</button>
  </div>
)
```

Or with a Redux-style reducer:

```js
const counterReducer = (count, action) => {
  switch (action.type) {
  case INCREMENT:
    return count + 1
  case DECREMENT:
    return count - 1
  default:
    return count
  }
}

const enhance = withReducer('counter', 'dispatch', counterReducer, 0)
const Counter = enhance(({ counter, dispatch }) =>
  <div>
    Count: {counter}
    <button onClick={() => dispatch({ type: INCREMENT })}>Increment</button>
    <button onClick={() => dispatch({ type: DECREMENT })}>Decrement</button>
  </div>
)
```

### ...perform the most common React patterns

Helpers like `componentFromProp()` and `withContext()` encapsulate common React patterns into a simple functional interface:

```js
const enhance = defaultProps({ component: 'button' })
const Button = enhance(componentFromProp('component'))

<Button /> // renders <button>
<Button component={Link} /> // renders <Link />
```

```js
const provide = store => withContext(
  { store: PropTypes.object },
  () => ({ store })
)

// Apply to base component
// Descendants of App have access to context.store
const AppWithContext = provide(store)(App)
```

### ...optimize rendering performance

No need to write a new class just to implement `shouldComponentUpdate()`. Recompose helpers like `pure()` and `onlyUpdateForKeys()` do this for you:

```js
// A component that is expensive to render
const ExpensiveComponent = ({ propA, propB }) => {...}

// Optimized version of same component, using shallow comparison of props
// Same effect as extending React.PureComponent
const OptimizedComponent = pure(ExpensiveComponent)

// Even more optimized: only updates if specific prop keys have changed
const HyperOptimizedComponent = onlyUpdateForKeys(['propA', 'propB'])(ExpensiveComponent)
```

### ...interoperate with other libraries

Recompose helpers integrate really nicely with external libraries like Relay, Redux, and RxJS

```js
const enhance = compose(
  // This is a Recompose-friendly version of Relay.createContainer(), provided by recompose-relay
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
  flattenProp('post')
)

const Post = enhance(({ title, content }) =>
  <article>
    <h1>{title}</h1>
    <div>{content}</div>
  </article>
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

## API docs

[Read them here](docs/API.md)

## Flow support

[Read the docs](docs/flow.md)

## Translation

[Traditional Chinese](https://github.com/neighborhood999/recompose)

## Why

Forget ES6 classes vs. `createClass()`.

An idiomatic React application consists mostly of function components.

```js
const Greeting = props =>
  <p>
    Hello, {props.name}!
  </p>
```

Function components have several key advantages:

- They help prevent abuse of the `setState()` API, favoring props instead.
- They encourage the ["smart" vs. "dumb" component pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
- They encourage code that is more reusable and modular.
- They discourage giant, complicated components that do too many things.
- In the future, they will allow React to make performance optimizations by avoiding unnecessary checks and memory allocations.

(Note that although Recompose encourages the use of function components whenever possible, it works with normal React components as well.)

### Higher-order components made easy

Most of the time when we talk about composition in React, we're talking about composition of components. For example, a `<Blog>` component may be composed of many `<Post>` components, which are composed of many `<Comment>` components.

Recompose focuses on another unit of composition: **higher-order components** (HoCs). HoCs are functions that accept a base component and return a new component with additional functionality. They can be used to abstract common tasks into reusable pieces.

Recompose provides a toolkit of helper functions for creating higher-order components.

## [Should I use this? Performance and other concerns](docs/performance.md)

## Usage

All functions are available on the top-level export.

```js
import { compose, mapProps, withState /* ... */ } from 'recompose'
```

**Note:** `react` is a _peer dependency_ of Recompose.  If you're using `preact`, add this to your `webpack.config.js`:

```js
resolve: {
  alias: {
    react: "preact"
  }
}
```

### Composition

Recompose helpers are designed to be composable:

```js
const BaseComponent = props => {...}

// This will work, but it's tedious
let EnhancedComponent = pure(BaseComponent)
EnhancedComponent = mapProps(/*...args*/)(EnhancedComponent)
EnhancedComponent = withState(/*...args*/)(EnhancedComponent)

// Do this instead
// Note that the order has reversed — props flow from top to bottom
const enhance = compose(
  withState(/*...args*/),
  mapProps(/*...args*/),
  pure
)
const EnhancedComponent = enhance(BaseComponent)
```

Technically, this also means you can use them as decorators (if that's your thing):

```js
@withState(/*...args*/)
@mapProps(/*...args*/)
@pure
class Component extends React.Component {...}
```

### Optimizing bundle size

Since `0.23.1` version recompose got support of ES2015 modules.
To reduce size all you need is to use bundler with tree shaking support
like [webpack 2](https://github.com/webpack/webpack) or [Rollup](https://github.com/rollup/rollup).

#### Using babel-plugin-lodash

[babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) is not only limited to [lodash](https://github.com/lodash/lodash). It can be used with `recompose` as well.

This can be done by updating `lodash` config in `.babelrc`.

```diff
 {
-  "plugins": ["lodash"]
+  "plugins": [
+    ["lodash", { "id": ["lodash", "recompose"] }]
+  ]
 }
```

After that, you can do imports like below without actually including the entire library content.

```js
import { compose, mapProps, withState } from 'recompose'
```

### Debugging

It might be hard to trace how does `props` change between HOCs. A useful tip is you can create a debug HOC to print out the props it gets without modifying the base component. For example:

make

```js
const debug = withProps(console.log)
```

then use it between HOCs

```js
const enhance = compose(
  withState(/*...args*/),
  debug, // print out the props here
  mapProps(/*...args*/),
  pure
)
```


## Who uses Recompose
If your company or project uses Recompose, feel free to add it to [the official list of users](https://github.com/acdlite/recompose/wiki/Sites-Using-Recompose) by [editing](https://github.com/acdlite/recompose/wiki/Sites-Using-Recompose/_edit) the wiki page.

## Recipes for Inspiration
We have a community-driven Recipes page. It's a place to share and see recompose patterns for inspiration. Please add to it! [Recipes](https://github.com/acdlite/recompose/wiki/Recipes).

## Feedback wanted

Project is still in the early stages. Please file an issue or submit a PR if you have suggestions! Or ping me (Andrew Clark) on [Twitter](https://twitter.com/acdlite).


## Getting Help

**For support or usage questions like “how do I do X with Recompose” and “my code doesn't work”, please search and ask on [StackOverflow with a Recompose tag](http://stackoverflow.com/questions/tagged/recompose?sort=votes&pageSize=50) first.**

We ask you to do this because StackOverflow has a much better job at keeping popular questions visible. Unfortunately good answers get lost and outdated on GitHub.

Some questions take a long time to get an answer. **If your question gets closed or you don't get a reply on StackOverflow for longer than a few days,** we encourage you to post an issue linking to your question. We will close your issue but this will give people watching the repo an opportunity to see your question and reply to it on StackOverflow if they know the answer.

Please be considerate when doing this as this is not the primary purpose of the issue tracker.

### Help Us Help You

On both websites, it is a good idea to structure your code and question in a way that is easy to read to entice people to answer it. For example, we encourage you to use syntax highlighting, indentation, and split text in paragraphs.

Please keep in mind that people spend their free time trying to help you. You can make it easier for them if you provide versions of the relevant libraries and a runnable small project reproducing your issue. You can put your code on [JSBin](http://jsbin.com) or, for bigger projects, on GitHub. Make sure all the necessary dependencies are declared in `package.json` so anyone can run `npm install && npm start` and reproduce your issue.
