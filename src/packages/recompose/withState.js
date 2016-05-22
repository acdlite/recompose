import createHelper from './createHelper'
import applyUpdateMiddleware from './applyUpdateMiddleware'

const withState = (stateName, stateUpdaterName, initialState) =>
  applyUpdateMiddleware(({ getProps }) => next => {
    let didUpdate = false
    let state

    /* eslint-disable no-use-before-define */
    const update = (props, cb) => next.update({
      ...props,
      [stateName]: state,
      [stateUpdaterName]: updateStateValue
    }, cb)

    const updateStateValue = (updateFn, cb) => {
      state = typeof updateFn === 'function'
        ? updateFn(state)
        : updateFn
      update(getProps(), cb)
    }
    /* eslint-enable no-use-before-define */

    return {
      update: (nextProps, cb) => {
        if (!didUpdate) {
          didUpdate = true
          state = typeof initialState === 'function'
            ? initialState(nextProps)
            : initialState
        }
        update(nextProps, cb)
      }
    }
  })

export default createHelper(withState, 'withState')
