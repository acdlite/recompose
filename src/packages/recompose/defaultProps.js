import createHelper from './createHelper'
import createElement from './createElement'

const defaultProps = props => BaseComponent => {
  const DefaultProps = ownerProps => createElement(BaseComponent, ownerProps)
  DefaultProps.defaultProps = props
  return DefaultProps
}

export default createHelper(defaultProps, 'defaultProps')
