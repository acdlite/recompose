import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const defaultProps = props => BaseComponent => {
  const createElement = curriedCreateElement(BaseComponent)
  const DefaultProps = ownerProps => createElement(ownerProps)
  DefaultProps.defaultProps = props
  return DefaultProps
}

export default createHelper(defaultProps, 'defaultProps')
