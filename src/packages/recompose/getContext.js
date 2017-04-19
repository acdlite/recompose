import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const getContext = contextTypes => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const GetContext = (ownerProps, context) =>
    factory({
      ...ownerProps,
      ...context,
    })

  GetContext.contextTypes = contextTypes

  return GetContext
}

export default createHelper(getContext, 'getContext')
