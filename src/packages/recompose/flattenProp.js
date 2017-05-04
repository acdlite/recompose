import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const flattenProp = propName => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const FlattenProp = props =>
    factory({
      ...props,
      ...props[propName],
    })

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(
      FlattenProp
    )
  }
  return FlattenProp
}

export default flattenProp
