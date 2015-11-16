import curry from 'lodash/function/curry'

const createHelper = (func, helperName, _helperLength, setDisplayName = true) => {
  const helperLength = _helperLength || func.length

  if (process.env.NODE_ENV !== 'production') {
    // In development, use custom implementation of curry that keeps track of
    // whether enough parameters have been applied. Also adds a `displayName`
    // to the base commponent.
    const wrapDisplayName = require('./wrapDisplayName')
    const apply = (previousArgs, nextArgs) => {
      const args = previousArgs.concat(nextArgs)
      const argsLength = args.length

      if (argsLength < helperLength) {
        const partialFunc = (...partialArgs) => apply(args, partialArgs)

        // The development version of `compose` will use these properties to
        // print warnings
        partialFunc.__missingHelperParameters = helperLength - argsLength - 1
        partialFunc.__helperName = helperName

        return partialFunc
      }

      const BaseComponent = args[helperLength - 1]

      const Component = func(...args)

      if (helperName && setDisplayName) {
        Component.displayName = wrapDisplayName(BaseComponent, helperName)
      }

      return Component
    }

    return (...args) => apply([], args)
  }

  // In production, use lodash's curry
  return curry(func, helperLength)
}

export default createHelper
