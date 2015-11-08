import curry from 'lodash/function/curry'
import wrapDisplayName from './wrapDisplayName'
import createElement from './createElement'

const defaultProps = (props, BaseComponent) => {
  const DefaultProps = ownerProps => createElement(BaseComponent, ownerProps)

  DefaultProps.defaultProps = props
  DefaultProps.displayName = wrapDisplayName(BaseComponent, 'defaultProps')

  return DefaultProps
}

export default curry(defaultProps)
