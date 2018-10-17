import { createFactory } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const getContext = contextTypes =>
  composeWithDisplayName('getContext', BaseComponent => {
    const factory = createFactory(BaseComponent)
    const GetContext = (ownerProps, context) =>
      factory({
        ...ownerProps,
        ...context,
      })

    GetContext.contextTypes = contextTypes

    return GetContext
  })

export default getContext
