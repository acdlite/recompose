rx-recompose
============

[![npm version](https://img.shields.io/npm/v/recompose-relay.svg?style=flat-square)](https://www.npmjs.com/package/rx-recompose)

Observable utilities for [Recompose](https://github.com/acdlite/recompose).

Previously, this library had a dependency on [RxJS](https://github.com/Reactive-Extensions/RxJS). Today, it is designed to work with any Observable implementation that complies with the upcoming [ES7 spec](https://github.com/zenparsing/es-observable). The [RxJS 5 beta](https://github.com/ReactiveX/RxJS) is recommended; examples may include references to RxJS operators.

`Observable` must be defined globally.

```
npm install --save rx-recompose@next
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

### `observeProps()`

```js
observeProps(
  mapPropsStream: (props$: Observable) => Observable,
  BaseComponent: ReactElementType
): ReactElementType
```

Maps an observable stream of owner props to a stream of child props.

### `createEventHandler()`

```js
createEventHandler(): Function & Observable
```

Creates an Observable that can be called like a function; when called, the observable emits a new value. This type of function is ideal for passing event handlers from `observeProps()`.

## Example

```js
import { observeProps, createEventHandler } from 'rx-recompose'
import { map } from 'rxjs/operator/map'
import { merge } from 'rxjs/operator/merge-static'
import { scan } from 'rxjs/operator/scan'
import { startWith } from 'rxjs/operator/startWith'
import { combineLatest } from 'rxjs/operator/combineLatest'

const Counter = observeProps(
  props$ => {
    const increment$ = createEventHandler()
    const decrement$ = createEventHandler()

    const count$ = merge(
        increment$::map(() => 1),
        decrement$::map(() => -1)
      )
      ::scan((count, n) => count + n, 0)
      ::startWith(0)

    return props$::combineLatest(
      count$,
      (props, count) => ({
        ...props,
        count,
        increment: increment$,
        decrement: decrement$,
      })
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
