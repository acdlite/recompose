import { createFactory } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const defaultProps = props => BaseComponent => {
  const factory = createFactory(BaseComponent)
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
