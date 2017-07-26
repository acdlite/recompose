import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'
import pick from './utils/pick'

const flattenProp = (propName, keys) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const FlattenProp = props =>
    factory({
      ...props,
      ...(keys ? pick(props[propName], keys) : props[propName]),
    })

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(
      FlattenProp
    )
  }
  return FlattenProp
}

export default flattenProp
