import lodashCompose from 'lodash/function/compose'

/**
 * In production, use lodash's compose
 */
let compose = lodashCompose

/**
 * In development, print warnings when composing higher-order component helpers
 * that have been applied with too few parameters
 */
if (process.env.NODE_ENV !== 'production') {
  const getDisplayName = require('./getDisplayName')

  compose = (...funcs) => {
    const needsParameters = []
    const doesntNeedParameters = []

    funcs.forEach(func => {
      const missingHelperParameters = func.__missingHelperParameters
      if (missingHelperParameters === 0) {
        doesntNeedParameters.push(func)
      } else if (missingHelperParameters > 0) {
        needsParameters.push(func)
      }
    })

    /**
     * Warn if a helper that needs parameters is composed with another helper
     * that doesn't need parameters. Checking for the second condition allows
     * partially-applied helpers to be composed before they become
     * higher-order components.
     */
    if (needsParameters.length && doesntNeedParameters.length) {
      return BaseComponent => {
        const displayName = getDisplayName(BaseComponent)

        needsParameters.forEach(func => {
          const helperName = func.__helperName
          const amountMissing = func.__missingHelperParameters
          /* eslint-disable */
          console.error(
          /* eslint-enable */
            `Attempted to compose \`${helperName}()\` with other ` +
            'higher-order component helpers, but it has been applied with ' +
            `${amountMissing} too few parameters. Check the implementation ` +
            `of <${displayName}>.`
          )
        })

        return lodashCompose(...funcs)(BaseComponent)
      }
    }

    return lodashCompose(...funcs)
  }
}

export default compose
