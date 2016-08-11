import createHelper from './createHelper'
import withHandlers from './withHandlers'

const partial = (functionName, funcArgs) => BaseComponent => withHandlers({
  [functionName]: props => {
    if (typeof props[functionName] !== 'function') {
      const type = typeof props[functionName]
      throw new Error(
        `partial(): ${functionName} should be a function not ${type}`
      )
    }

    return (...args) => props[functionName](...funcArgs, ...args)
  }
})(BaseComponent)

export default createHelper(partial, 'partial')
