# API

In these API docs, a **higher-order component** (HOC) refers to a function that accepts a single React component and returns a new React component.

```js
const EnhancedComponent = hoc(BaseComponent)
```

This form makes HOCs (sometimes called **enhancers**) composable:

```js
const composedHoc = compose(hoc1, hoc2, hoc3)

// Same as
const composedHoc = BaseComponent => hoc1(hoc2(hoc3(BaseComponent)))
```

Most Recompose helpers are **functions that return higher-order components**:

```js
const hoc = mapProps(ownerProps => childProps)
const EnhancedComponent = hoc(BaseComponent)

// Same as
const EnhancedComponent = mapProps(ownerProps => childProps)(BaseComponent)
```

Some, like `pure`, are higher-order components themselves:

```js
const PureComponent = pure(BaseComponent)
```

## TOC

* [Higher-order components](#higher-order-components)
  + [`mapProps()`](#mapprops)
  + [`withProps()`](#withprops)
  + [`withPropsOnChange()`](#withpropsonchange)
  + [`withHandlers()`](#withhandlers)
  + [`defaultProps()`](#defaultprops)
  + [`renameProp()`](#renameprop)
  + [`renameProps()`](#renameprops)
  + [`flattenProp()`](#flattenprop)
  + [`withState()`](#withstate)
  + [`withStateHandlers()`](#withstatehandlers)
  + [`withReducer()`](#withreducer)
  + [`branch()`](#branch)
  + [`renderComponent()`](#rendercomponent)
  + [`renderNothing()`](#rendernothing)
  + [`shouldUpdate()`](#shouldupdate)
  + [`pure()`](#pure)
  + [`onlyUpdateForKeys()`](#onlyupdateforkeys)
  + [`onlyUpdateForPropTypes()`](#onlyupdateforproptypes)
  + [`withContext()`](#withcontext)
  + [`getContext()`](#getcontext)
  + [`lifecycle()`](#lifecycle)
  + [`toClass()`](#toclass)
  + [`toRenderProps()`](#torenderprops)
  + [`fromRenderProps()`](#fromrenderprops)
* [Static property helpers](#static-property-helpers)
  + [`setStatic()`](#setstatic)
  + [`setPropTypes()`](#setproptypes)
  + [`setDisplayName()`](#setdisplayname)
* [Utilities](#utilities)
  + [`compose()`](#compose)
  + [`getDisplayName()`](#getdisplayname)
  + [`wrapDisplayName()`](#wrapdisplayname)
  + [`shallowEqual()`](#shallowequal)
  + [`isClassComponent()`](#isclasscomponent)
  + [`createSink()`](#createsink)
  + [`componentFromProp()`](#componentfromprop)
  + [`nest()`](#nest)
  + [`hoistStatics()`](#hoiststatics)
* [Observable utilities](#observable-utilities)
  + [`componentFromStream()`](#componentfromstream)
  + [`componentFromStreamWithConfig()`](#componentfromstreamwithconfig)
  + [`mapPropsStream()`](#mappropsstream)
  + [`mapPropsStreamWithConfig()`](#mappropsstreamwithconfig)
  + [`createEventHandler()`](#createeventhandler)
  + [`createEventHandlerWithConfig()`](#createeventhandlerwithconfig)
  + [`setObservableConfig()`](#setobservableconfig)

## Higher-order components

### `mapProps()`

```js
mapProps(
  propsMapper: (ownerProps: Object) => Object,
): HigherOrderComponent
```

Accepts a function that maps owner props to a new collection of props that are passed to the base component.

`mapProps()` pairs well with functional utility libraries like [lodash/fp](https://github.com/lodash/lodash/tree/npm/fp). For example, Recompose does not come with a `omitProps()` function, but you can easily build one using lodash-fp's `omit()`:

```js
const omitProps = keys => mapProps(props => omit(keys, props))

// Because of currying in lodash-fp, this is the same as
const omitProps = compose(mapProps, omit)
```

### `withProps()`

```js
withProps(
  createProps: (ownerProps: Object) => Object | Object
): HigherOrderComponent
```

Like `mapProps()`, except the newly created props are merged with the owner props.

Instead of a function, you can also pass a props object directly. In this form, it is similar to `defaultProps()`, except the provided props take precedence over props from the owner.


### `withPropsOnChange()`

```js
withPropsOnChange(
  shouldMapOrKeys: Array<string> | (props: Object, nextProps: Object) => boolean,
  createProps: (ownerProps: Object) => Object
): HigherOrderComponent
```

Like `withProps()`, except the new props are only created when one of the owner props specified by `shouldMapOrKeys` changes. This helps ensure that expensive computations inside `createProps()` are only executed when necessary.

Instead of an array of prop keys, the first parameter can also be a function that returns a boolean, given the current props and the next props. This allows you to customize when `createProps()` should be called.

### `withHandlers()`

```js
withHandlers(
  handlerCreators: {
    [handlerName: string]: (props: Object) => Function
  } |
  handlerCreatorsFactory: (initialProps) => {
    [handlerName: string]: (props: Object) => Function
  }
): HigherOrderComponent
```

Takes an object map of handler creators or a factory function. These are higher-order functions that accept a set of props and return a function handler:

This allows the handler to access the current props via closure, without needing to change its signature.

Handlers are passed to the base component as immutable props, whose identities are preserved across renders. This avoids a common pitfall where functional components create handlers inside the body of the function, which results in a new handler on every render and breaks downstream `shouldComponentUpdate()` optimizations that rely on prop equality. This is the main reason to use `withHandlers` to create handlers instead of using `mapProps` or `withProps`, which will create new handlers every time when it get updated.

Usage example:

```js
const enhance = compose(
  withState('value', 'updateValue', ''),
  withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      submitForm(props.value)
    }
  })
)

const Form = enhance(({ value, onChange, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <label>Value
      <input type="text" value={value} onChange={onChange} />
    </label>
  </form>
)
```

### `defaultProps()`

```js
defaultProps(
  props: Object
): HigherOrderComponent
```

Specifies props to be passed by default to the base component. Similar to `withProps()`, except the props from the owner take precedence over props provided to the HoC.

Although it has a similar effect, using the `defaultProps()` HoC is *not* the same as setting the static `defaultProps` property directly on the component.


### `renameProp()`

```js
renameProp(
  oldName: string,
  newName: string
): HigherOrderComponent
```

Renames a single prop.

### `renameProps()`

```js
renameProps(
  nameMap: { [key: string]: string }
): HigherOrderComponent
```

Renames multiple props, using a map of old prop names to new prop names.

### `flattenProp()`

```js
flattenProp(
  propName: string
): HigherOrderComponent
```

Flattens a prop so that its fields are spread out into the props object.

```js
const enhance = compose(
  withProps({
    object: { a: 'a', b: 'b' },
    c: 'c'
  }),
  flattenProp('object')
)
const Abc = enhance(BaseComponent)

// Base component receives props: { a: 'a', b: 'b', c: 'c', object: { a: 'a', b: 'b' } }
```

An example use case for `flattenProp()` is when receiving fragment data from Relay. Relay fragments are passed as an object of props, which you often want flattened out into its constituent fields:

```js
// The `post` prop is an object with title, author, and content fields
const enhance = flattenProp('post')
const Post = enhance(({ title, content, author }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `withState()`

```js
withState(
  stateName: string,
  stateUpdaterName: string,
  initialState: any | (props: Object) => any
): HigherOrderComponent
```

Passes two additional props to the base component: a state value, and a function to update that state value. The state updater has the following signature:

```js
stateUpdater<T>((prevValue: T) => T, ?callback: Function): void
stateUpdater(newValue: any, ?callback: Function): void
```

The first form accepts a function which maps the previous state value to a new state value. You'll likely want to use this state updater along with `withHandlers()` to create specific updater functions. For example, to create a HoC that adds basic counting functionality to a component:

```js
const addCounting = compose(
  withState('counter', 'setCounter', 0),
  withHandlers({
    increment: ({ setCounter }) => () => setCounter(n => n + 1),
    decrement: ({ setCounter }) => () =>  setCounter(n => n - 1),
    reset: ({ setCounter }) => () => setCounter(0)
  })
)
```

The second form accepts a single value, which is used as the new state.

Both forms accept an optional second parameter, a callback function that will be executed once `setState()` is completed and the component is re-rendered.

An initial state value is required. It can be either the state value itself, or a function that returns an initial state given the initial props.

### `withStateHandlers()`

```js
withStateHandlers(
  initialState: Object | (props: Object) => any,
  stateUpdaters: {
    [key: string]: (state:Object, props:Object) => (...payload: any[]) => Object
  }
)

```

Passes state object properties and immutable updater functions
in a form of `(...payload: any[]) => Object` to the base component.

Every state updater function accepts state, props and payload and must return a new state or undefined. The new state is shallowly merged with the previous state.
Returning undefined does not cause a component rerender.

Example:

```js
  const Counter = withStateHandlers(
    ({ initialCounter = 0 }) => ({
      counter: initialCounter,
    }),
    {
      incrementOn: ({ counter }) => (value) => ({
        counter: counter + value,
      }),
      decrementOn: ({ counter }) => (value) => ({
        counter: counter - value,
      }),
      resetCounter: (_, { initialCounter = 0 }) => () => ({
        counter: initialCounter,
      }),
    }
  )(
    ({ counter, incrementOn, decrementOn, resetCounter }) =>
      <div>
        <Button onClick={() => incrementOn(2)}>Inc</Button>
        <Button onClick={() => decrementOn(3)}>Dec</Button>
        <Button onClick={resetCounter}>Reset</Button>
      </div>
  )
```

### `withReducer()`

```js
withReducer<S, A>(
  stateName: string,
  dispatchName: string,
  reducer: (state: S, action: A) => S,
  initialState: S | (ownerProps: Object) => S
): HigherOrderComponent
```

Similar to `withState()`, but state updates are applied using a reducer function. A reducer is a function that receives a state and an action, and returns a new state.

Passes two additional props to the base component: a state value, and a dispatch method. The dispatch method has the following signature:

```js
dispatch(action: Object, ?callback: Function): void
```

It sends an action to the reducer, after which the new state is applied. It also accepts an optional second parameter, a callback function with the new state as its only argument.

### `branch()`

```js
branch(
  test: (props: Object) => boolean,
  left: HigherOrderComponent,
  right: ?HigherOrderComponent
): HigherOrderComponent
```

Accepts a test function and two higher-order components. The test function is passed the props from the owner. If it returns true, the `left` higher-order component is applied to `BaseComponent`; otherwise, the `right` higher-order component is applied. If the `right` is not supplied, it will by default render the wrapped component.

### `renderComponent()`

```js
renderComponent(
  Component: ReactClass | ReactFunctionalComponent | string
): HigherOrderComponent
```

Takes a component and returns a higher-order component version of that component.

This is useful in combination with another helper that expects a higher-order component, like `branch()`:

```js
// `isLoading()` is a function that returns whether or not the component
// is in a loading state
const spinnerWhileLoading = isLoading =>
  branch(
    isLoading,
    renderComponent(Spinner) // `Spinner` is a React component
  )

// Now use the `spinnerWhileLoading()` helper to add a loading spinner to any
// base component
const enhance = spinnerWhileLoading(
  props => !(props.title && props.author && props.content)
)
const Post = enhance(({ title, author, content }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `renderNothing()`

```js
renderNothing: HigherOrderComponent
```

A higher-order component that always renders `null`.

This is useful in combination with another helper that expects a higher-order component, like `branch()`:

```js
// `hasNoData()` is a function that returns true if the component has
// no data
const hideIfNoData = hasNoData =>
  branch(
    hasNoData,
    renderNothing
  )

// Now use the `hideIfNoData()` helper to hide any base component
const enhance = hideIfNoData(
  props => !(props.title && props.author && props.content)
)
const Post = enhance(({ title, author, content }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `shouldUpdate()`

```js
shouldUpdate(
  test: (props: Object, nextProps: Object) => boolean
): HigherOrderComponent
```

Higher-order component version of [`shouldComponentUpdate()`](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate). The test function accepts both the current props and the next props.


### `pure()`

```js
pure: HigherOrderComponent
```

Prevents the component from updating unless a prop has changed. Uses `shallowEqual()` to test for changes.

### `onlyUpdateForKeys()`

```js
onlyUpdateForKeys(
  propKeys: Array<string>
): HigherOrderComponent
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
const enhance = onlyUpdateForKeys(['title', 'content', 'author'])
const Post = enhance(({ title, content, author }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `onlyUpdateForPropTypes()`

```js
onlyUpdateForPropTypes: HigherOrderComponent
```

Works like `onlyUpdateForKeys()`, but prop keys are inferred from the `propTypes` of the base component. Useful in conjunction with `setPropTypes()`.

If the base component does not have any `propTypes`, the component will never receive any updates. This probably isn't the expected behavior, so a warning is printed to the console.

```js
import PropTypes from 'prop-types'; // You need to import prop-types. See https://facebook.github.io/react/docs/typechecking-with-proptypes.html

const enhance = compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired
  })
)

const Post = enhance(({ title, content, author }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `withContext()`

```js
withContext(
  childContextTypes: Object,
  getChildContext: (props: Object) => Object
): HigherOrderComponent
```

Provides context to the component's children. `childContextTypes` is an object of React prop types. `getChildContext()` is a function that returns the child context. Use along with `getContext()`.

### `getContext()`

```js
getContext(
  contextTypes: Object
): HigherOrderComponent
```

Gets values from context and passes them along as props. Use along with `withContext()`.

### `lifecycle()`

```js
lifecycle(
  spec: Object,
): HigherOrderComponent
```

A higher-order component version of [`React.Component()`](https://facebook.github.io/react/docs/react-api.html#react.component). It supports the entire `Component` API, except the `render()` method, which is implemented by default (and overridden if specified; an error will be logged to the console). You should use this helper as an escape hatch, in case you need to access component lifecycle methods.

Any state changes made in a lifecycle method, by using `setState`, will be propagated to the wrapped component as props.

Example:
```js
const PostsList = ({ posts }) => (
  <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
)

const PostsListWithData = lifecycle({
  componentDidMount() {
    fetchPosts().then(posts => {
      this.setState({ posts });
    })
  }
})(PostsList);
```

### `toClass()`

```js
toClass: HigherOrderComponent
```

Takes a function component and wraps it in a class. This can be used as a fallback for libraries that need to add a ref to a component, like Relay.

If the base component is already a class, it returns the given component.


### `toRenderProps()`

```js
toRenderProps(
  hoc: HigherOrderComponent
): ReactFunctionalComponent
```

Creates a component that accepts a function as a children with the high-order component applied to it. 

Example:
```js
const enhance = withProps(({ foo }) => ({ fooPlusOne: foo + 1 }))
const Enhanced = toRenderProps(enhance)

<Enhanced foo={1}>{({ fooPlusOne }) => <h1>{fooPlusOne}</h1>}</Enhanced>
// renders <h1>2</h1>
```

### `fromRenderProps()`

```js
fromRenderProps(
  RenderPropsComponent: ReactClass | ReactFunctionalComponent,
  propsMapper: (...props: any[]) => Object,
  renderPropName?: string
): HigherOrderComponent
```

Takes a **render props** component and a function that maps props to a new collection of props that are passed to the base component.

The default value of third parameter (`renderPropName`) is `children`. You can use any prop (e.g., `render`) for render props component to work.

> Check the official documents [Render Props](https://reactjs.org/docs/render-props.html#using-props-other-than-render) for more details.

```js
import { fromRenderProps } from 'recompose';
const { Consumer: ThemeConsumer } = React.createContext({ theme: 'dark' });
const { Consumer: I18NConsumer } = React.createContext({ i18n: 'en' });
const RenderPropsComponent = ({ render, value }) => render({ value: 1 });

const EnhancedApp = compose(
  // Context (Function as Child Components)
  fromRenderProps(ThemeConsumer, ({ theme }) => ({ theme })),
  fromRenderProps(I18NConsumer, ({ i18n }) => ({ locale: i18n })),
  // Render props
  fromRenderProps(RenderPropsComponent, ({ value }) => ({ value }), 'render'),
)(App);

// Same as
const EnhancedApp = () => (
  <ThemeConsumer>
    {({ theme }) => (
      <I18NConsumer>
        {({ i18n }) => (
          <RenderPropsComponent
            render={({ value }) => (
              <App theme={theme} locale={i18n} value={value} />
            )}
          />
        )}
      </I18NConsumer>
    )}
  </ThemeConsumer>
)
```

## Static property helpers

These functions look like higher-order component helpers — they are curried and component-last. However, rather than returning a new component, they mutate the base component by setting or overriding a static property.

### `setStatic()`

```js
setStatic(
  key: string,
  value: any
): HigherOrderComponent
```

Assigns a value to a static property on the base component.

### `setPropTypes()`

```js
setPropTypes(
  propTypes: Object
): HigherOrderComponent
```

Assigns to the `propTypes` property on the base component.

### `setDisplayName()`

```js
setDisplayName(
  displayName: string
): HigherOrderComponent
```

Assigns to the `displayName` property on the base component.

## Utilities

Recompose also includes some additional helpers that aren't higher-order components, but are still useful.

### `compose()`

```js
compose(...functions: Array<Function>): Function
```

Use to compose multiple higher-order components into a single higher-order component. This works exactly like the function of the same name in Redux, or lodash's `flowRight()`.

### `getDisplayName()`

```js
getDisplayName(
  component: ReactClass | ReactFunctionalComponent
): string
```

Returns the display name of a React component. Falls back to `'Component'`.

### `wrapDisplayName()`

```js
wrapDisplayName(
  component: ReactClass | ReactFunctionalComponent,
  wrapperName: string
): string
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
createSink(callback: (props: Object) => void): ReactClass
```

Creates a component that renders nothing (null) but calls a callback when receiving new props.

### `componentFromProp()`

```js
componentFromProp(propName: string): ReactFunctionalComponent
```

Creates a component that accepts a component as a prop and renders it with the remaining props.

Example:

```js
const enhance = defaultProps({ component: 'button' })
const Button = enhance(componentFromProp('component'))

<Button foo="bar" /> // renders <button foo="bar" />
<Button component="a" foo="bar" />  // renders <a foo="bar" />
<Button component={Link} foo="bar" />  // renders <Link foo="bar" />
```

### `nest()`

```js
nest(
  ...Components: Array<ReactClass | ReactFunctionalComponent | string>
): ReactClass
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

### `hoistStatics()`

```js
hoistStatics(
  hoc: HigherOrderComponent,
  blacklist: Object
): HigherOrderComponent
```

Augments a higher-order component so that when used, it copies non-react static properties from the base component to the new component. This is helpful when using Recompose with libraries like Relay.

Note that this only hoists _non-react_ statics. The following static properties will not be hoisted: `childContextTypes`, `contextTypes`, `defaultProps`, `displayName`, `getDefaultProps`, `mixins`, `propTypes`, and `type`. The following native static methods will also be ignored: `name`, `length`, `prototype`, `caller`, `arguments`, and `arity`.

You can exclude more static properties by passing them as `blacklist` object:

```js
hoistStatics(EnhancedComponent, { foo: true })(BaseComponent) // Exclude `foo`
```

## Observable utilities

It turns out that much of the React Component API can be expressed in terms of observables:

- Instead of `setState()`, combine multiple streams together.
- Instead of `getInitialState()`, use `startWith()` or `concat()`.
- Instead of `shouldComponentUpdate()`, use `distinctUntilChanged()`, `debounce()`, etc.

Other benefits include:

- No distinction between state and props – everything is a stream.
- No need to worry about unsubscribing from event listeners. Subscriptions are handled for you.
- Sideways data loading is trivial – just combine the props stream with an external stream.
- Access to an ecosystem of observable libraries, such as RxJS.


**Recompose's observable utilities can be configured to work with any observable or stream-like library. See [`setObservableConfig()`](#setobservableconfig) below for details.**

### `componentFromStream()`

```js
componentFromStream(
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

Example:

```js
const Counter = componentFromStream(props$ => {
  const { handler: increment, stream: increment$ } = createEventHandler()
  const { handler: decrement, stream: decrement$ } = createEventHandler()
  const count$ = Observable.merge(
      increment$.mapTo(1),
      decrement$.mapTo(-1)
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

### `componentFromStreamWithConfig()`

```js
componentFromStreamWithConfig<Stream>(
  config: {
    fromESObservable<T>: ?(observable: Observable<T>) => Stream<T>,
    toESObservable<T>: ?(stream: Stream<T>) => Observable<T>,
  }
) => (
  propsToReactNode: (props$: Stream<object>) => Stream<ReactNode>
): ReactComponent
```

Alternative to `componentFromStream()` that accepts an observable config and returns a customized `componentFromStream()` which uses the specified observable library. This option is recommended if you want to avoid global state with `setObservableConfig()`.

**Note: The following configuration modules are not included in the main export. You must import them individually, as shown in the examples.**

#### RxJS

```js
import rxjsConfig from 'recompose/rxjsObservableConfig'
const componentFromStream = componentFromStreamWithConfig(rxjsConfig)
```

#### RxJS 4 (legacy)

```js
import rxjs4Config from 'recompose/rxjs4ObservableConfig'
const componentFromStream = componentFromStreamWithConfig(rxjs4Config)
```

#### most

```js
import mostConfig from 'recompose/mostObservableConfig'
const componentFromStream = componentFromStreamWithConfig(mostConfig)
```

#### xstream

```js
import xstreamConfig from 'recompose/xstreamObservableConfig'
const componentFromStream = componentFromStreamWithConfig(xstreamConfig)
```

#### Bacon

```js
import baconConfig from 'recompose/baconObservableConfig'
const componentFromStream = componentFromStreamWithConfig(baconConfig)
```

#### Kefir

```js
import kefirConfig from 'recompose/kefirObservableConfig'
const componentFromStream = componentFromStreamWithConfig(kefirConfig)
```

#### Flyd

```js
import flydConfig from 'recompose/flydObservableConfig'
const componentFromStream = componentFromStreamWithConfig(flydConfig)
```

### `mapPropsStream()`

```js
mapPropsStream(
  ownerPropsToChildProps: (props$: Observable<object>) => Observable<object>,
  BaseComponent: ReactElementType
): ReactComponent
```

A higher-order component version of `componentFromStream()` — accepts a function that maps an observable stream of owner props to a stream of child props, rather than directly to a stream of React nodes. The child props are then passed to a base component.

You may want to use this version to interoperate with other Recompose higher-order component helpers.

### `mapPropsStreamWithConfig()`
```js
mapPropsStreamWithConfig<Stream>(
  config: {
    fromESObservable<T>: ?(observable: Observable<T>) => Stream<T>,
    toESObservable<T>: ?(stream: Stream<T>) => Observable<T>,
  },
) => (
  ownerPropsToChildProps: (props$: Stream<object>) => Stream<object>,
  BaseComponent: ReactElementType
): ReactComponent
```

Alternative to `mapPropsStream()` that accepts a observable config and returns a customized `mapPropsStream()` that uses the specified observable library. See `componentFromStreamWithConfig()` above.

```js
const enhance = mapPropsStream(props$ => {
  const timeElapsed$ = Observable.interval(1000)
  return props$.combineLatest(timeElapsed$, (props, timeElapsed) => ({
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
  handler: (value: T) => void,
  stream: Observable<T>
}
```

Returns an object with properties `handler` and `stream`. `stream` is an observable sequence, and `handler` is a function that pushes new values onto the sequence. Useful for creating event handlers like `onClick`.

### `createEventHandlerWithConfig()`
```js
createEventHandlerWithConfig<T>(
  config: {
    fromESObservable<T>: ?(observable: Observable<T>) => Stream<T>,
    toESObservable<T>: ?(stream: Stream<T>) => Observable<T>,
  }
) => (): {
  handler: (value: T) => void,
  stream: Observable<T>
}
```

Alternative to `createEventHandler()` that accepts an observable config and returns a customized `createEventHandler()` that uses the specified observable library. See `componentFromStreamWithConfig()` above.

### `setObservableConfig()`

```js
setObservableConfig<Stream>({
  fromESObservable<T>: ?(observable: Observable<T>) => Stream<T>,
  toESObservable<T>: ?(stream: Stream<T>) => Observable<T>
})
```

**Note: `setObservableConfig()` uses global state, and could break apps if used inside a package intended to be shared. See `componentFromStreamWithConfig()` and `mapPropsStreamWithConfig()` as alternatives for package authors.**

Observables in Recompose are plain objects that conform to the [ES Observable proposal](https://github.com/zenparsing/es-observable). Usually, you'll want to use them alongside an observable library like RxJS so that you have access to its suite of operators. By default, this requires you to convert the observables provided by Recompose before applying any transforms:

```js
mapPropsStream(props$ => {
  const rxjsProps$ = Rx.Observable.from(props$)
  // ...now you can use map, filter, scan, etc.
  return transformedProps$
})
```

This quickly becomes tedious. Rather than performing this transform for each stream individually, `setObservableConfig()` sets a global observable transform that is applied automatically.

```js
import Rx from 'rxjs'
import { setObservableConfig } from 'recompose'

setObservableConfig({
  // Converts a plain ES observable to an RxJS 5 observable
  fromESObservable: Rx.Observable.from
})
```

In addition to `fromESObservable`, the config object also accepts `toESObservable`, which converts a stream back into an ES observable. Because RxJS 5 observables already conform to the ES observable spec, `toESObservable` is not necessary in the above example. However, it is required for libraries like RxJS 4 or xstream, whose streams do not conform to the ES observable spec.

Fortunately, you likely don't need to worry about how to configure Recompose for your favorite stream library, because Recompose provides drop-in configuration for you.

**Note: The following configuration modules are not included in the main export. You must import them individually, as shown in the examples.**

#### RxJS

```js
import rxjsconfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsconfig)
```

#### RxJS 4 (legacy)

```js
import rxjs4config from 'recompose/rxjs4ObservableConfig'
setObservableConfig(rxjs4config)
```

#### most

```js
import mostConfig from 'recompose/mostObservableConfig'
setObservableConfig(mostConfig)
```

#### xstream

```js
import xstreamConfig from 'recompose/xstreamObservableConfig'
setObservableConfig(xstreamConfig)
```

#### Bacon

```js
import baconConfig from 'recompose/baconObservableConfig'
setObservableConfig(baconConfig)
```

#### Kefir

```js
import kefirConfig from 'recompose/kefirObservableConfig'
setObservableConfig(kefirConfig)
```

#### Flyd

```js
import flydConfig from 'recompose/flydObservableConfig'
setObservableConfig(flydConfig)
```
