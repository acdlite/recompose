import mapProps from './mapProps'
import omit from './utils/omit'
import createHelper from './createHelper'

const flattenProp = propName =>
  mapProps(props => ({
    ...omit(props, [propName]),
    ...props[propName]
  }))

export default createHelper(flattenProp, 'flattenProp')
