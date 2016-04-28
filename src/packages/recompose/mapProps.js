import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const mapProps = propsMapper => BaseComponent => {
  const createElement = curriedCreateElement(BaseComponent)
  return props => createElement(propsMapper(props))
}

export default createHelper(mapProps, 'mapProps')
