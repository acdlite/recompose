import createHelper from './createHelper'
import createElement from './createElement'

const mapProps = propsMapper => BaseComponent =>
  props => createElement(BaseComponent, propsMapper(props))

export default createHelper(mapProps, 'mapProps')
