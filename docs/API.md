# API

Docs are annotated using Flow type notation, given the following types:

```js
type StatelessFunctionComponent = (props: Object, ?context: Object) => ReactElement;
type ReactElementType = Class<ReactComponent> | StatelessFunctionComponent | string;
type HigherOrderComponent = (BaseComponent: ReactElementType) => ReactElementType;
```
For the purposes of typing, a higher-order component is a function that accepts a base React component and returns a new React component. However, sometimes we use the term higher-order component to refer to a function that takes one or more parameters in addition to a base component. For example, `mapProps()` takes both a props mapping function and a base component. Higher-order components helpers in Recompose are component-last and curried, so when we call a helper with all its parameters except the final one, it returns a "true" higher-order component. The distinction isn't all that important in most cases except for type signatures; just be aware that it exists.

## Higher-order component helpers

Higher-order component helpers are automatically curried, and the final parameter is a React component class.

### `mapProps()`

```js
mapProps(
  propsMapper: (ownerProps: Object) => Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Accepts a function that maps owner props to a new collection of props that are passed to the base component.

`mapProps()` pairs well with functional utility libraries like [lodash-fp](https://github.com/lodash/lodash-fp). For example, Recompose does not come with a `omitProps()` function, but you can build one easily using lodash-fp's `omit()`:

```js
const omitProps = (keys, BaseComponent) => mapProps(omit(keys), BaseComponent);
```

### `mapPropsOnChange()`

```js
mapPropsOnChange(
  depdendentPropKeys: Array<string>,
  propsMapper: (dependentProps: Object) => Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Similar to as `mapProps()`, but child props are only re-computed when one of the props specified by `dependentPropKeys` has changed. This helps ensure that computationally intense `propsMapper` functions are only executed when necessary.

### `withProps()`

```js
withProps(
  props: Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Passes additional props to the base component. Similar to `defaultProps()`, except the provided props take precedence over props from the owner.

### `defaultProps()`

```js
defaultProps(
  props: Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Specifies props to be passed by default to the base component. Similar to `withProps()`, except the props from the owner take precedence over props provided to the HoC.

Although it has the same effect, using the `defaultProps()` HoC is *not* the same as setting the static `defaultProps` property directly on the component.


### `renameProp()`

```js
renameProp(
  oldName: string,
  newName: string,
  BaseComponent: ReactElementType
): ReactElementType
```

Renames a single prop.

### `renameProps()`

```js
renameProps(
  nameMap: { [key: string]: string },
  BaseComponent: ReactElementType
): ReactElementType
```

Renames multiple props, using a map of old prop names to new prop names.

### `flattenProp()`

```js
renameProps(
  propName: string,
  BaseComponent: ReactElementType
): ReactElementType
```

Flattens an prop so that its fields are spread out into the props object.

```js
const Abc = compose(
  withProps({
    object: { a: 'a', b: 'b' },
    c: 'c'
  }),
  flattenProp('object')
)(BaseComponent);

// Base component receives props: { a: 'a', b: 'b', c: 'c' }
```

An example use for `flattenProps()` is when receiving fragment data from Relay. Relay fragments are passes as an object of props, which you often want flattened out into its constituent fields:

```js
// The `post` prop is an object with title, author, and content fields
const Post = flattenProp('post', ({ title, author, content }) => (
  ({ title, content, author }) => (
    <article>
      <h1>{title}</h1>
      <h2>By {author.name}</h2>
      <div>{content}</div>
    </article>
  )
)
```

### `withState()`

```js
withState(
  stateName: string,
  stateUpdaterName: string,
  initialState: any | (props: Object) => any,
  BaseComponent: ReactElementType
): ReactElementType
```

Passes two additional props to the base component: a state value, and a function to update that state value. The state updater has the following signature:

```js
stateUpdater<T>((prevValue: T) => T, ?callback: Function): void
stateUpdate(newValue: any, ?callback: Function): void
```

The first form accepts a function which maps the previous state value to a new state value. You'll likely want to use this state updater along with `mapProps()` to create specific updater functions. For example, to create an HoC that adds basic counting functionality to a component:

```js
const addCounting = compose(
  withState('counter', 'setCounter', 0),
  mapProps({ setCounter, ...rest } => ({
    increment: () => setCounter(n => n + 1),
    decrement: () => setCounter(n => n - 1),
    reset: () => setCounter(0),
    ...rest
  }))
);
```

The second form accepts a single value, which is used as the new state.

Both forms accept an optional second parameter, a callback function that will be executed once `setState()` is completed and the component is re-rendered.

An initial state value is required. It can be either the state value itself, or a function that returns an initial state given the initial props.

### `withReducer()`

```js
withReducer<T, U>(
  stateName: string,
  dispatchName: string,
  reducer: (state: T, action: U) => T,
  initialState: T,
  BaseComponent: ReactElementType
): ReactElementType
```

Similar to `withState()`, but state updates are applied using a reducer function. A reducer is a function that receives a state and an action, and returns a new state.

Passes two additional props to the base component: a state value, and a dispatch method. The dispatch method sends an action to the reducer, and the new state is applied.


### `branch()`

```js
branch(
  test: (props: Object) => boolean,
  left: HigherOrderComponent,
  right: HigherOrderComponent,
  BaseComponent: ReactElementType
): ReactElementType
```

Accepts a test function and two higher-order components. The test function is passed the props from the owner. If it returns true, the `left` higher-order component is applied to `BaseComponent`; otherwise, the `right` higher-order component is applied.

### `renderComponent()`

```js
renderComponent(
  Component: ReactElementType,
  BaseComponent: any
): ReactElementType
```

Takes a component and returns a higher-order component version of that component. The last parameter, BaseComponent, can be anything or nothing: it is ignored completely.

This is useful in combination with another helper that expects a higher-order component, like `branch()`:

```js
// `hasLoaded()` is a function that returns whether or not the the component
// has all the props it needs
const spinnerWhileLoading = (hasLoaded, BaseComponent) => branch(
  hasLoaded,
  renderComponent(BaseComponent),
  renderComponent(Spinner) // <Spinner> is a React component
);

// Now use the `spinnerWhileLoading()` helper to add a loading spinner to any
// base component
const Post = spinnerWhileLoading(
  props => props.title && post.author && post.content
  ({ title, author, content }) => (
    <article>
      <h1>{title}</h1>
      <h2>By {author.name}</h2>
      <div>{content}</div>
    </article>
  )
);
```

### `renderNothing()`

```js
renderNothing(
  BaseComponent: any
): ReactElementType
```

Like `renderComponent()`, but renders `null`.

### `shouldUpdate()`

```js
shouldUpdate(
  test: (props: Object, nextProps: Object) => boolean,
  BaseComponent: ReactElementType
): ReactElementType
```

Higher-order component version of [`shouldComponentUpdate()`](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate). The test function accepts both the current props and the next props.


### `pure()`

```js
pure(BaseComponent: ReactElementType): ReactElementType
```

Prevents the component from updating unless a prop has changed. Uses `shallowEqual()` to test for changes.

### `onlyUpdateForKeys()`

```js
onlyUpdateForKeys(
  propKeys: Array<string>,
  BaseComponent: ReactElementType
): ReactElementType
```

Prevents the component from updating unless a prop corresponding to one of the given keys has updated. Uses `shallowEqual()` to test for changes.

This is a much better optimization than the popular approach of using PureRenderMixin, `shouldPureComponentUpdate()`, or Recompose's own `pure()` helper, because those tools compare *every* prop, whereas `onlyUpdateForKeys()` only cares about the props that you specify.

Example:

```js
/**
 * If the owner passes unnecessary props (say, an array of comments), it will
 * not lead to wasted render cycles.
 *
 * Goes well with destructuring because it's clear which props the component
 * actually cares about.
 */
const Post = onlyUpdateForKeys(
  ['title', 'content', 'author'],
  ({ title, content, author }) => (
    <article>
      <h1>{title}</h1>
      <h2>By {author.name}</h2>
      <div>{content}</div>
    </article>
  )
);
```

### `onlyUpdateForPropTypes()`

```js
onlyUpdateForProps(
  BaseComponent: ReactElementType
): ReactElementType
```

Works like `onlyUpdateForKeys()`, but prop keys are inferred from the `propTypes` of the base component. Useful in conjunction with `setPropTypes()`.

If the base component does not have any `propTypes`, the component will never receive any updates. This probably isn't the expected behavior, so a warning is printed to the console.

```js
const Post = compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    title: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    author: React.PropTypes.object.isRequired
  })
)(({ title, content, author }) => (
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
));
```

### `withContext()`

```js
withContext(
  childContextTypes: Object,
  getChildContext: (props: Object) => Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Provides context to the component's children. `childContextTypes` is an object of React prop types. `getChildContext()` is a function that returns the child context. Use along with `getContext()`.

### `getContext()`

```js
getContext(
  contextTypes: Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Gets values from context and passes them along as props. Use along with `withContext()`.

### `doOnReceiveProps()`

```js
doOnReceiveProps(
  callback: (props: Object) => void,
  BaseComponent: ReactElementType
): ReactElementType
```

Executes a callback when the component is receiving new props. Also called at initialization.

### `lifecycle()`

```js
lifecycle(
  setup: (component: ReactComponent) => void
  teardown: (component: ReactComponent) => void,
  BaseComponent: ReactElementType
): ReactElementType
```

Provides access to the React component instance on initialization (setup) and unmounting (teardown). The most common use case for this is to manage subscriptions to an external source.

`setup` is called within the component's constructor, so you can set the initial state using assignment as in a normal React component class. After initialization ,calls to `component.setState()` will update the state as expected.

The state object is mixed into the props and passed to the base component.

### `toClass()`

```js
toClass(
  BaseComponent: ReactElementType
): ReactElementType
```

Takes a function component and wraps it in a class. This can be used as a fallback for libraries that need to add a ref to a component, like Relay.

If the base component is already a class, it returns the given component.

## Static property helpers

These functions look like higher-order component helpers — they are curried and component-last. However, rather than returning a new component, they mutate the base component by setting or overriding a static property.

### `setStatic()`

```js
setStatic(
  key: string,
  value: any,
  BaseComponent: ReactElementType
): ReactElementType
```

Assigns a value to a static property on the base component.

### `setPropTypes()`

```js
setPropTypes(
  propTypes: Object,
  BaseComponent: ReactElementType
): ReactElementType
```

Assigns to the `propTypes` property on the base component.

### `setDisplayName()`

```js
setDisplayName(
  displayName: string,
  BaseComponent: ReactElementType
): ReactElementType
```

Assigns to the `displayName` property on the base component.

## Utilities

Recompose also includes some additional helpers that aren't higher-order components, but are still useful.

### `compose()`

```js
compose(...functions: Array<Function>): Function
```

Use to compose multiple higher-order components into a single higher-order component.

It will print a warning if a higher-order component helper has insufficient parameters. For example, if you forget to pass an initial state to `withReducer()`:

```js
compose(
  withReducer('state', 'dispatch', reducer), // Forgot initialState
  ...otherHelpers
)(BaseComponent)
```

> Attempted to compose `withReducer()` with other higher-order component helpers, but it has been applied with 1 too few parameters. Check the implementation of \<BaseComponent\>.


These warnings are only printed in development. In production, this just is an alias for lodash's [`compose()` / `flowRight()`](https://lodash.com/docs#flowRight).

### `getDisplayName()`

```js
getDisplayName(component: ReactElementType): string
```

Returns the display name of a React component. Falls back to `'Component'`.

### `wrapDisplayName()`

```js
wrapDisplayName(component: ReactElementType, wrapperName: string): string
```

Returns a wrapped version of a React component's display name. For instance, if the display name of `component` is `'Post'`, and `wrapperName` is `'mapProps'`, the return value is `'mapProps(Post)'`. Most Recompose higher-order components use `wrapDisplayName()`.

### `shallowEqual()`

```js
shallowEqual(a: Object, b: Object): boolean
```

Returns true if objects are shallowly equal.

### `isClassComponent()`

```js
isClassComponent(value: any): boolean
```

Returns true if the given value is a React component class.

### `createSink()`

```js
createSink(callback: (props: Object) => void): ReactElementType
```

Creates a component that renders nothing (null) but calls a callback when receiving new props.

### `componentFromProp()`

```js
componentFromProp(propName: string): ReactElementType
```

Creates a component that accepts a component as a prop and renders it with the remaining props.

Example:

```js
const Button = defaultProps(
  { component: 'button' },
  componentFromProp('component')
);

<Button foo="bar" /> // renders <button foo="bar" />
<Button component="a" foo="bar" />  // renders <a foo="bar" />
<Button component={Link} foo="bar" />  // renders <Link foo="bar" />
```

### `nest()`

```js
nest(...Components: Array<ReactElementType>): ReactElementType
```

Composes components by nesting each one inside the previous. For example:

```js
// Given components A, B, and C
const ABC = nest(A, B, C)
<ABC pass="through">Child</ABC>

// Effectively the same as
<A pass="through">
  <B pass="through">
    <C pass="through">
      Child
    </C>
  </B>
</A>
```
