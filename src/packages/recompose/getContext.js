import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const getContext = contextTypes => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
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
