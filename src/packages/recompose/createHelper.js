const createHelper = (
  func,
  helperName,
  setDisplayName = true,
  noArgs = false
) => {
  if (process.env.NODE_ENV !== 'production' && setDisplayName) {
    const wrapDisplayName = require('./wrapDisplayName').default

    if (noArgs) {
      return BaseComponent => {
        const Component = func(BaseComponent)
        Component.displayName = wrapDisplayName(BaseComponent, helperName)
        return Component
      }
    }

    return (...args) => BaseComponent => {
      const Component = noArgs
        ? func(BaseComponent)
        : func(...args)(BaseComponent)

      Component.displayName = wrapDisplayName(BaseComponent, helperName)

      return Component
    }
  }

  return func
}

export default createHelper
