import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const mapProps = propsMapper => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)
  return props => createElement(propsMapper(props))
}

export default createHelper(mapProps, 'mapProps')
