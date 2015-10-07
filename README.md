Recompose
-----

[![build status](https://img.shields.io/travis/acdlite/recompose/master.svg?style=flat-square)](https://travis-ci.org/acdlite/recompose)
[![npm version](https://img.shields.io/npm/v/recompose.svg?style=flat-square)](https://www.npmjs.com/package/recompose)

Recompose is a microcomponentization toolkit for React. Think of it like lodash, but for React components.

```
npm install recompose --save
```

**Documentation is a work-in-progress**. Feedback is welcome and encouraged. If you'd like to collaborate on this project, let me know.

## Quick example: Counter

Here's an example of a stateful counter component created using only pure functions and Recompose:

```js
import { compose, withState, mapProps } from 'recompose';

const Counter = ({ counter, increment, decrement }) => (
  <p>
    Count: {counter}
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </p>
);

const CounterContainer = compose(
  withState('counter', 'setCounter', 0),
  mapProps(({ setCounter, ...rest }) => ({
    increment: () => setCounter(n => n + 1),
    decrement: () => setCounter(n => n - 1),
    ...rest
  }))
)(Counter);
```

More complex examples are coming soon. Here's a [mini React Redux clone](https://github.com/acdlite/recompose/blob/master/src/__tests__/withContext-test.js#L13) from the test suite.

Read on for more about the library, its goals, and how it works.

## API docs

[Read them here](docs/API.md)

## Usage

All functions are available on the top-level export.

```js
import { compose, mapProps, withState /* ... */ } from 'recompose';
```

Or if you only want to require specify modules, you can import them individually:

```js
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
// ... and so on
```

This is a good option for library authors who don't want to bloat their bundle sizes.

## Background

### What is microcomponentization all about?

Forget ES6 classes vs. `createClass()`. React 0.14 introduces **[stateless function components](https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components)**, which allow you to express components as pure functions:

```js
const Greeting = props => (
  <p>
    Hello, {props.name}!
  </p>
);
```

Function components have several key advantages:

- They prevent abuse of the `setState()` API, favoring props instead.
- They're simpler, and therefore less error-prone.
- They encourage the smart vs. dumb component pattern.
- They encourage code that is more reusable and modular.
- They discourage giant, complicated components that do too many things.
- In the future, they will allow React to make performance optimizations by avoiding unnecessary checks and memory allocations.

We call the practice of writing small, pure, reusable components **microcomponentization**.

Note that although Recompose encourages the use of function components whenever possible, it works with normal React components as well.

### Higher-order components made easy

Most of the time when we talk about composition in React, we're talking about composition of components. For example, a `<Blog>` component may be composed of many `<Post>` components, which are composed of many `<Comment>` components.

However, that's only the beginning. Recompose focuses on another unit of composition: **higher-order components** (HoCs). HoCs are functions that accept a base component and return a new component with additional functionality. They can be used to abstract common tasks into reusable pieces.

Recompose provides a toolkit of helper functions for creating higher-order components. Most of these helpers are themselves are higher-order components. You can compose the helpers together to make new HoCs, or apply them to a base component.

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

## Design guidelines

- Favor fixed arguments over variadic arguments.
- Avoid function overloading, with few exceptions.
- Components should have display names that are useful.

## TODO

- Improve docs to better explain the value proposition for higher-order component utilities.
- Add examples to API docs.
- Build more complex, real-world examples.
- Add developer-friendly warnings; e.g. warn if function passed to `compose()` is not a higher-order component, as it likely indicates too few parameters were passed to a curried function.
