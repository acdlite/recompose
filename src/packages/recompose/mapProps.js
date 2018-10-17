import { createFactory } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const mapProps = propsMapper =>
  composeWithDisplayName('mapProps', BaseComponent => {
    const factory = createFactory(BaseComponent)
    return props => factory(propsMapper(props))
  })

export default mapProps
