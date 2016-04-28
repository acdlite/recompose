import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const getContext = contextTypes => BaseComponent => {
  const createElement = curriedCreateElement(BaseComponent)
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
