import { createFactory } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const defaultProps = props =>
  composeWithDisplayName('defaultProps', BaseComponent => {
    const factory = createFactory(BaseComponent)
    const DefaultProps = ownerProps => factory(ownerProps)
    DefaultProps.defaultProps = props
    return DefaultProps
  })

export default defaultProps
