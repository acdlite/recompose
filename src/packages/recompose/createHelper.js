const createHelper = (
  func,
  helperName,
  setDisplayName = true,
  noArgs = false
) => {
  if (process.env.NODE_ENV !== 'production' && setDisplayName) {
    /* eslint-disable global-require */
    const wrapDisplayName = require('./wrapDisplayName').default
    /* eslint-enable global-require */

    if (noArgs) {
      return BaseComponent => {
        const Component = func(BaseComponent)
        Component.displayName = wrapDisplayName(BaseComponent, helperName)
        return Component
      }
    }

    return (...args) => {
      if (args.length > func.length) {
        /* eslint-disable */
        console.error(
        /* eslint-enable */
          `Too many arguments passed to ${helperName}(). It should called ` +
          `like so: ${helperName}(...args)(BaseComponent).`
        )
      }
      const hoc = func(...args)
      return BaseComponent => {
        const Component = hoc(BaseComponent)
        Component.displayName = wrapDisplayName(BaseComponent, helperName)
        return Component
      }
    }
  }

  return func
}

export default createHelper
