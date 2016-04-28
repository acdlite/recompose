import omit from 'lodash/omit'
import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const flattenProp = propName => BaseComponent => {
  const createElement = curriedCreateElement(BaseComponent)
  return props => (
    createElement({
      ...omit(props, propName),
      ...props[propName]
    })
  )
}

export default createHelper(flattenProp, 'flattenProp')
