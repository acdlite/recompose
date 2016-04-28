import omit from 'lodash/omit'
import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const flattenProp = propName => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)
  return props => (
    createElement({
      ...omit(props, propName),
      ...props[propName]
    })
  )
}

export default createHelper(flattenProp, 'flattenProp')
