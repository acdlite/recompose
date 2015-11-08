import omit from 'lodash/object/omit'
import createHelper from './createHelper'
import createElement from './createElement'

const componentFromProp = propName =>
  props => createElement(props[propName], omit(props, propName))

export default createHelper(componentFromProp, 'componentFromProp')
