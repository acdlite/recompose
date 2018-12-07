import { createFactory } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const flattenProp = propName =>
  composeWithDisplayName('flattenProp', BaseComponent => {
    const factory = createFactory(BaseComponent)
    return props =>
      factory({
        ...props,
        ...props[propName],
      })
  })

export default flattenProp
