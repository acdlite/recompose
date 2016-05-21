import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const defaultProps = props => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const DefaultProps = ownerProps => factory(ownerProps)
  DefaultProps.defaultProps = props
  return DefaultProps
}

export default createHelper(defaultProps, 'defaultProps')
