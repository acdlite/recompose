# API

## Higher-order components

Most Recompose helpers are higher-order components. All HoCs are automatically curried, and the final parameter is a React component class.

### `mapProps()`

```js
mapProps(
  propsMapper: (ownerProps: Object) => Object,
  baseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Accepts a function that maps owner props to a new collection of props that are passed to the base component.

`mapProps()` pairs well with functional utility libraries like [lodash-fp](https://github.com/lodash/lodash-fp). For example, Recompose does not come with a `omitProps()` function, but you can build one easily using lodash-fp's `omit()`:

```js
const omitProps = (keys, BaseComponent) => mapProps(omit(keys), BaseComponent);
```

### `mapPropsOnUpdate()`

```js
mapPropsOnUpdate(
  depdendentPropKeys: Array<string>,
  propsMapper: (ownerProps: Object) => Object,
  baseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Same as `mapProps()`, but child props are only re-computed when one of the props specified by `dependentPropKeys` has been updated. This helps ensure that computationally intense `propsMapper` functions are only executed when necessary.

### `withProps()`

```js
withProps(
  props: Object,
  baseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Passes additional props to the base component. Similar to `defaultProps()`, except the provided props take precedence over props from the owner.

### `defaultProps()`

```js
defaultProps(
  props: Object,
  baseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Specifies props to be passed by default to the base component. Similar to `withProps()`, except the props from the owner take precedence over props provided to the HoC.

Although it has the same effect, using the `defaultProps()` HoC is *not* the same as setting the static `defaultProps` property directly on the component.


### `renameProp()`

```js
renameProp(
  oldName: string,
  newName: string,
  baseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Renames a single prop.

### `renameProps()`

```js
renameProps(
  nameMap: { [key: string]: string },
  baseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Renames multiple props, using a map of old prop names to new prop names.

### `withState()`

```js
withState(
  stateName: string,
  stateUpdaterName, string,
  initialState: any,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Passes two additional props to the base component: a state value, and a function to update that state value. The state updater has the following signature:

```js
stateUpdater<T>((prevValue: T) => T): void
stateUpdate(newValue: any): void
```

The first form accepts a function which maps the previous state value to a new state value. You'll likely want to use this state updater along with `mapProps()` to create specific updater functions. For example, to create an HoC that adds basic counting functionality to a component:

```js
const addCounting = compose(
  withState('counter', 'setCounter', 0),
  mapProps({ setCounter, ...rest } => ({
    increment: () => setCounter(n => n + 1),
    decrement: () => setCounter(n => n - 1),
    reset: () => setCounter(() => 0),
    ...rest
  }))
);
```

The second form accepts a single value, which is used as the new state.

### `branch()`

```js
branch(
  test: (props: Object) => boolean,
  left: HigherOrderComponent,
  right: HigherOrderComponent,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Accepts a test function and two higher-order components. The test function is passed the props from the owner. If it returns true, the `left` higher-order component is applied to `BaseComponent`; otherwise, the `right` higher-order component is applied.

### `shouldUpdate()`

```js
shouldUpdate(
  test: (props: Object, nextProps: Object) => boolean,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Higher-order component version of [`shouldComponentUpdate()`](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate). The test function accepts both the current props and the next props.


### `pure()`

```js
pure(BaseComponent: Class<ReactComponent>): Class<ReactComponent>
```

Prevents the component from updating unless a prop has changed. Uses `shallowEqual()` to test for changes.

### `onlyUpdateForKeys()`

```js
onlyUpdateForKeys(
  propKeys: Array<string>,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Prevents the component from updating unless a prop corresponding to one of the given keys has updated. Uses `shallowEqual()` to test for changes.

### `withContext()`

```js
withContext(
  childContextTypes: Object,
  getChildContext: (props: Object) => Object,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Provides context to the component's children. `childContextTypes` is an object of React prop types. `getChildContext()` is a function that returns the child context. Use along with `getContext()`.

### `getContext()`

```js
getContext(
  contextTypes: Object,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Gets values from context and passes them along as props. Use along with `withContext()`.

### `doOnReceiveProps()`

```js
doOnReceiveProps(
  callback: props,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Executes a callback when the component is receiving new props. Also called at initialization.

### `lifecycle()`

```js
lifecycle(
  setup: (component: ReactComponent) => void
  teardown: (component: ReactComponent) => void,
  BaseComponent: Class<ReactComponent>
): Class<ReactComponent>
```

Provides access to the React component instance on initialization (setup) and unmounting (teardown). The most common use case for this is to manage subscriptions to an external source.

`setup` is called within the component's constructor, so you can set the initial state using assignment as in a normal React component class. After initialization ,calls to `component.setState()` will update the state as expected.

The state object is mixed into the props and passed to the base component.

## Utilities

Recompose also includes some additional helpers that aren't higher-order components, but are still useful.

### `compose()`

```js
compose(...functions: Array<Function>): Function
```

Alias for lodash's [`compose()` / `flowRight()`](https://lodash.com/docs#flowRight). Use to compose multiple higher-order components into a single higher-order component.

There's currently no difference between using this `compose()` and using the `compose()` from lodash, Redux, etc., but in the future, Recompose may include some helpful warnings in development to check for currying errors.

### `getDisplayName()`

```js
getDisplayName(component: Class<ReactComponent>): string
```

Returns the display name of a React component. Falls back to `'Component'`.

### `wrapDisplayName()`

```js
wrapDisplayName(component: Class<ReactComponent>, wrapperName: string): string
```

Returns a wrapped version of a React component's display name. For instance, if the display name of `component` is `'Post'`, and `wrapperName` is `'mapProps'`, the return value is `'mapProps(Post)'`. Most Recompose higher-order components use `wrapDisplayName()`.

### `shallowEqual()`

```js
shallowEqual(a: Object, b: Object): boolean
```

Returns true if objects are shallowly equal.

### `createSink()`

```js
createSink(callback: (props: Object) => void): Class<ReactComponent>
```

Creates a component that renders nothing (null) but calls a callback when receiving new props.
