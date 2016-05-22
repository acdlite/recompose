import pick from './utils/pick'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createHocFromMiddleware from './utils/createHocFromMiddleware'

const withPropsOnChange = (shouldMapOrKeys, propsMapper) => {
  const shouldMap = typeof shouldMapOrKeys === 'function'
    ? shouldMapOrKeys
    : (props, nextProps) => !shallowEqual(
        pick(props, shouldMapOrKeys),
        pick(nextProps, shouldMapOrKeys),
      )

  return createHocFromMiddleware(({ getProps }) => next => {
    let didUpdate = false
    let computedProps = null

    const update = (props, cb) => {
      next.update({
        ...props,
        ...computedProps
      }, cb)
    }

    return {
      update: (nextProps, cb) => {
        if (!didUpdate || shouldMap(getProps(), nextProps)) {
          didUpdate = true
          computedProps = propsMapper(nextProps)
        }
        update(nextProps, cb)
      }
    }
  })
}

export default createHelper(withPropsOnChange, 'withPropsOnChange')
