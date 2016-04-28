rx-recompose
============

[![npm version](https://img.shields.io/npm/v/rx-recompose.svg?style=flat-square)](https://www.npmjs.com/package/rx-recompose)

RxJS utilities for [Recompose](https://github.com/acdlite/recompose).

```
npm install --save rx-recompose
```

It turns out that much of the React Component API can be expressed in terms of observables:

- Instead of `setState()`, combine multiple streams together.
- Instead of `getInitialState()`, use `startWith()` or `concat()`.
- Instead of `shouldComponentUpdate()`, use `distinctUntilChanged()`, `debounce()`, etc.

Other benefits include:

- No distinction between state and props – everything is an stream.
- No need to worry about unsubscribing from event listeners. Subscriptions are handled for you.
- Sideways data loading is trivial – just combine the props stream with an external stream.
- Access to the full ecosystem of RxJS libraries.

## API

### `createComponent()`

```js
createComponent(
  propsToReactNode: (props$: Observable<object>) => Observable<ReactNode>
): ReactComponent
```

Creates a React component by mapping an observable stream of props to a stream of React nodes (vdom).

You can think of `propsToReactNode` as a function `f` such that

```js
const vdom$ = f(props$)
```

where `props$` is a stream of props and `vdom$` is a stream of React nodes. This formulation similar to the popular notion of React views as a function, often communicated as

```
v = f(d)
```

See below for a full example.

### `mapPropsStream()`

```js
mapPropsStream(
  ownerPropsToChildProps: (props$: Observable<object>) => Observable<object>,
  BaseComponent: ReactElementType
): ReactComponent
```

A higher-order component version of `createComponent()` — accepts a function that maps an observable stream of owner props to a stream of child props, rather than directly to a stream of React nodes. The child props are then passed to a base component.

You may want to use this version to interoperate with other Recompose higher-order component helpers.

```js
const enhance = mapPropsStream(props$ => {
  const timeElapsed$ = Observable.interval(1000).pluck('value')
  props$.combineLatest(timeElapsed$, (props, timeElapsed) => ({
    ...props,
    timeElapsed
  }))
})

const Timer = enhance(({ timeElapsed }) =>
  <div>Time elapsed: {timeElapsed}</div>
)
```

### `createEventHandler()`

```js
createEventHandler<T>(): {
  handler: (value: T) => void
  stream: Observable<T>,
}
```

Returns an object with properties `handler` and `stream`. `stream` is an observable sequence, and `handler` is a function that pushes new values onto the sequence. (This is akin to mailboxes in Elm.) Useful for creating event handlers like `onClick`.

## Example

```js
import { createComponent, createEventHandler } from 'rx-recompose'
import { Observable } from 'rx'

const Counter = createComponent(props$ => {
  const { mapPropsStream: increment, stream: increment$ } = createEventHandler()
  const { handler: decrement, stream: decrement$ } = createEventHandler()
  const count$ = Observable.merge(
      increment$.map(() => 1),
      decrement$.map(() => -1)
    )
    .startWith(0)
    .scan((count, n) => count + n, 0)

  return props$.combineLatest(
    count$,
    (props, count) =>
      <div {...props}>
        Count: {count}
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>
  )
})
```
