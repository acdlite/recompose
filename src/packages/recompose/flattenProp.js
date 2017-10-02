import { createFactory } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const flattenProp = propName => BaseComponent => {
  const factory = createFactory(BaseComponent)
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
