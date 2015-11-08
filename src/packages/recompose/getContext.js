import curry from 'lodash/function/curry'
import wrapDisplayName from './wrapDisplayName'
import createElement from './createElement'

const getContext = (contextTypes, BaseComponent) => {
  const GetContext = (ownerProps, context) => (
    createElement(BaseComponent, {
      ...ownerProps,
      ...context
    })
  )

  GetContext.displayName = wrapDisplayName(BaseComponent, 'getContext')
  GetContext.contextTypes = contextTypes

  return GetContext
}

export default curry(getContext)
