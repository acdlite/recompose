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

    return (...args) => {
      if (process.env.NODE_ENV !== 'production' && args.length > func.length) {
        /* eslint-disable */
        console.error(
        /* eslint-enable */
          `Too many arguments passed to ${helperName}(). It should called ` +
          `like so: ${helperName}(...args)(BaseComponent).`
        )
      }

      return BaseComponent => {
        const Component = noArgs
          ? func(BaseComponent)
          : func(...args)(BaseComponent)

        Component.displayName = wrapDisplayName(BaseComponent, helperName)

        return Component
      }
    }
  }

  return func
}

export default createHelper
