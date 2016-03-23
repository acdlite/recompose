import createHelper from './createHelper'
import createElement from './createElement'

const getContext = contextTypes => BaseComponent => {
  const GetContext = (ownerProps, context) => (
    createElement(BaseComponent, {
      ...ownerProps,
      ...context
    })
  )

  GetContext.contextTypes = contextTypes

  return GetContext
}

export default createHelper(getContext, 'getContext')
