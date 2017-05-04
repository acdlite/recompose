import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const defaultProps = props => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const DefaultProps = ownerProps => factory(ownerProps)
  DefaultProps.defaultProps = props
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(
      DefaultProps
    )
  }
  return DefaultProps
}

export default defaultProps
