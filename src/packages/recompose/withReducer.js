import createHelper from './createHelper'
import createHocFromMiddleware from './utils/createHocFromMiddleware'

const withReducer = (stateName, dispatchName, reducer, initialState) =>
  createHocFromMiddleware(({ getProps }) => next => {
    let didUpdate = false
    let state

    /* eslint-disable no-use-before-define */
    const update = (props, cb) => next.update({
      ...props,
      [stateName]: state,
      [dispatchName]: dispatch
    }, cb)

    const dispatch = action => {
      state = reducer(state, action)
      update(getProps())
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

export default createHelper(withReducer, 'withReducer')
