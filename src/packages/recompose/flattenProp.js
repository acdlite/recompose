import omit from 'lodash/omit'
import createHelper from './createHelper'
import createElement from './createElement'

const flattenProp = propName => BaseComponent =>
  props => (
    createElement(BaseComponent, {
      ...omit(props, propName),
      ...props[propName]
    })
  )

export default createHelper(flattenProp, 'flattenProp')
