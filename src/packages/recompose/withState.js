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

    return {
      update: (props, cb) => {
        if (!didUpdate) {
          didUpdate = true
          state = typeof initialState === 'function'
            ? initialState(props)
            : initialState
        }
        update(props, cb)
      }
    }
  })

export default createHelper(withState, 'withState')
