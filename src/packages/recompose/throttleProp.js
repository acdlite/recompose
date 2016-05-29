import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createHocFromMiddleware from './utils/createHocFromMiddleware'

const throttle = (callback, wait) => {
  let requestId
  let latestArgs

  const later = () => {
    requestId = null

    if (latestArgs) {
      callback(...latestArgs)
      latestArgs = null
    }
  }

  const throttled = (...args) => {
    if (requestId == null) {
      callback(...args)
      requestId = setTimeout(later, wait)
    } else {
      latestArgs = args
    }
  }

  throttled.cancel = () =>
    clearTimeout(requestId)

  return throttled
}

const throttleProp = (propName, wait) =>
  createHocFromMiddleware(({ getProps }) => next => {
    let latestThrottledProp
    let latestOtherProps

    const update = (throttledProp, otherProps, cb) =>
      next.update({
        [propName]: throttledProp,
        ...otherProps
      }, cb)

    const throttledUpdate = throttle((throttledProp, otherProps, cb) => {
      latestThrottledProp = throttledProp
      update(throttledProp, otherProps, cb)
    }, wait)

    return {
      update: (nextProps, cb) => {
        const {
          [propName]: throttledProp,
          ...otherProps
        } = getProps() || {}

        const {
          [propName]: nextThrottledProp,
          ...nextOtherProps
        } = nextProps

        if (!shallowEqual(otherProps, nextOtherProps)) {
          latestOtherProps = nextOtherProps
          update(latestThrottledProp, nextOtherProps, cb)
        }

        if (throttledProp !== nextThrottledProp) {
          throttledUpdate(nextThrottledProp, latestOtherProps, cb)
        }
      },

      destroy: () => throttledUpdate.cancel()
    }
  })

export default createHelper(throttleProp, 'throttleProp')
