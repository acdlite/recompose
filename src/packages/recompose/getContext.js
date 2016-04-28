import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const getContext = contextTypes => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)
  const GetContext = (ownerProps, context) => (
    createElement({
      ...ownerProps,
      ...context
    })
  )

  GetContext.contextTypes = contextTypes

  return GetContext
}

export default createHelper(getContext, 'getContext')
