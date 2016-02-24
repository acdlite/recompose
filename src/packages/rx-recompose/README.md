rx-recompose
============

[![npm version](https://img.shields.io/npm/v/recompose-relay.svg?style=flat-square)](https://www.npmjs.com/package/rx-recompose)

[RxJS](https://github.com/ReactiveX/RxJS) utilities for [Recompose](https://github.com/acdlite/recompose).

```
npm install --save rx-recompose
```

It turns out that much of the React Component API can be expressed in terms of observables:

- Instead of `setState()`, combine multiple streams together.
- Instead of `getInitialState()`, use `startWith()`.
- Instead of `shouldComponentUpdate()`, use `distinctUntilChanged()`, `debounce()`, etc.

Other benefits include:

- No distinction between state and props – everything is an stream.
- No need to worry about unsubscribing from event listeners. Subscriptions are handled for you.
- Sideways data loading is trivial – just combine the props stream with an external stream.
- Access to the full ecosystem of RxJS libraries.

Examples to come.

## API

### `observeProps()`

```js
observeProps(
  mapPropsStream: (props$: Observable) => Observable | { [propKey: string]: Observable },
  BaseComponent: ReactElementType
): ReactElementType
```

Maps an observable stream of owner props to a stream of child props, or to an object of observables.

In the second form, an object of streams is turned into an stream of objects. To illustrate, the following two `mapPropsStream()` functions are equivalent:

```js
const mapPropsStream1 = () => Observable.just({ a, b, c }),

// Same as
const mapPropsStream2 = () => ({
  a: Observable.just(a),
  b: Observable.just(b),
  c: Observable.just(c)
})
```

The second form is often more convenient because it avoids the need for `Observable.combineLatest()`, but note that it is also more limiting: you must explicitly declare every prop that is passed to the base component. There's no way to pass through arbitrary props from the owner. For full control over the stream of props, use the first form.

### `createEventHandler()`

```js
createEventHandler(
  callback: ?(value: any) => any
): Function & Subject
```

Creates a Subject that is also a function. When called, the subject emits a new value. This type of function is ideal for passing event handlers from `observeProps()`:

```js
const Counter = observeProps(
  props$ => {
    const increment$ = createEventHandler()
    const decrement$ = createEventHandler()

    const count$ = Observable.merge(
        increment$.map(() => 1),
        decrement$.map(() => -1)
      )
      .startWith(0)
      .scan((count, n) => count + n)

    return {
      increment: Observable.just(increment$),
      decrement: Observable.just(decrement$),
      count: count$
    }
  },
  ({ count, decrement, increment, ...props }) => (
    <div {...props}>
      Count: {count}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
)
```

Allows one optional function argument, that will be called every time the eventHandler is called,
with the same argument, and will yield the return value of that same callback. This way, you can
totally cancel a form submission using the eventHandler:

```
const onSubmit = createEventHandler(e => {
  e.preventDefault()
  return false
})
```
