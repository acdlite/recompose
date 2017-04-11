import createHelper from './createHelper'
import withHandlers from './withHandlers'

const partialWithProps = (functionName, propArgNames) => BaseComponent => (
  withHandlers({
    [functionName]: props => {
      if (typeof props[functionName] !== 'function') {
        const type = typeof props[functionName]
        throw new Error(
          `partial(): ${functionName} should be a function not ${type}`
        )
      }

      const funcArgs = propArgNames.map(item => props[item])

      return (...args) => props[functionName](...funcArgs, ...args)
    }
  })(BaseComponent)
)


export default createHelper(partialWithProps, 'partialWithProps')
