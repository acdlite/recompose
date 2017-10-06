import { createFactory } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const getContext = contextTypes => BaseComponent => {
  const factory = createFactory(BaseComponent)
  const GetContext = (ownerProps, context) =>
    factory({
      ...ownerProps,
      ...context,
    })

  GetContext.contextTypes = contextTypes

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(
      GetContext
    )
  }
  return GetContext
}

export default getContext
