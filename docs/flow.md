# Flow support for recompose

## How it works

In most cases all you need is to declare a props type of enhanced Component.
Flow will infer all other types you need.

Example:

```javascript
import type { HOC } from 'recompose';

type EnhancedComponentProps = {
  text?: string,
};

const baseComponent = ({ text }) => <div>{text}</div>;

const enhance:HOC<*, EnhancedComponentProps> = compose(
  defaultProps({
    text: 'world',
  }),
  withProps(({ text }) => ({
    text: `Hello ${text}`
  }))
);

export default enhance(baseComponent);

```

See it in action.

![recompose-flow](https://user-images.githubusercontent.com/5077042/28116959-0c96ae2c-6714-11e7-930e-b1454c629908.gif)

## How to start

The easiest way is to start from example.

Look at [this](http://grader-meets-16837.netlify.com/) app [source](../types/flow-example)


## Support

Type definitions of recompose HOCs are splitted into 2 parts.

### Part 1 - HOCs with good flow support

In most cases you can use them without big issues.
Type inference and errors detection works near well.

These HOCs are: *defaultProps, mapProps, withProps, withStateHandlers, withHandlers, pure, onlyUpdateForKeys, shouldUpdate, renderNothing, renderComponent, branch, withPropsOnChange, onlyUpdateForPropTypes, toClass, withContext, getContext, setStatic, setPropTypes, setDisplayName*

#### Known issues for "good" HOCs

see `test_mapProps.js` - inference work but type errors are not detected in hocs

### Part 2 - other HOCs

To use these HOCs - you need to provide type information (no automatic type inference).
You must be a good voodoo dancer.

See `test_voodoo.js` for the idea.

Some recomendations:

- *flattenProp,renameProp, renameProps* can easily be replaced with _withProps_
- *withReducer, withState* -> use _withStateHandlers_ instead
- _lifecycle_ -> you don't need recompose if you need a _lifecycle_, just use React class instead
- _mapPropsStream_ -> see `test_mapPropsStream.js`

#### Known issues for above HOCs

See `test_voodoo.js`, `test_mapPropsStream.js`

### Utils

*getDisplayName, wrapDisplayName, shallowEqual,isClassComponent, createSink, componentFromProp, nest, hoistStatics.*

### Articles

[Typing Higher-order Components in Recompose With Flow](https://medium.com/flow-type/flow-support-in-recompose-1b76f58f4cfc)

### Faq

Why to use existential type with `HOC<*, Blbla>` isn't it possible to avoid this?

*I tried to use type alias but haven't found how to make it work.*

## Thanks

Big thanks to [@gcanti](https://github.com/gcanti) for his work on PR [#241](https://github.com/acdlite/recompose/pull/241), it was nice and clear base for current definitions.
