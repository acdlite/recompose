import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const defaultProps = props => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)
  const DefaultProps = ownerProps => createElement(ownerProps)
  DefaultProps.defaultProps = props
  return DefaultProps
}

export default createHelper(defaultProps, 'defaultProps')
