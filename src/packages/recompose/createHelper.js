import wrapDisplayName from './wrapDisplayName'

const createHelper = (
  func,
  helperName,
  setDisplayName = true,
  noArgs = false
) => {
  if (process.env.NODE_ENV !== 'production' && setDisplayName) {
    if (noArgs) {
      return BaseComponent => {
        const Component = func(BaseComponent)
        Component.displayName = wrapDisplayName(BaseComponent, helperName)
        return Component
      }
    }

    return (...args) =>
      BaseComponent => {
        const Component = func(...args)(BaseComponent)
        Component.displayName = wrapDisplayName(BaseComponent, helperName)
        return Component
      }
  }

  return func
}

export default createHelper
