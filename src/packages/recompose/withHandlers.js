import applyUpdateMiddleware from './applyUpdateMiddleware'
import createHelper from './createHelper'

const mapValues = (obj, func) => {
  const result = []
  let i = 0
  /* eslint-disable no-restricted-syntax */
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      i += 1
      result[key] = func(obj[key], key, i)
    }
  }
  /* eslint-enable no-restricted-syntax */
  return result
}

const withHandlers = handlers =>
  applyUpdateMiddleware(({ getProps }) => next => {
    let cachedHandlers = {}

    const handlerProps = mapValues(
      handlers,
      (createHandler, handlerName) => (...args) => {
        const cachedHandler = cachedHandlers[handlerName]
        if (cachedHandler) {
          return cachedHandler(...args)
        }

        const handler = createHandler(getProps())
        cachedHandlers[handlerName] = handler

        if (
          process.env.NODE_ENV !== 'production' &&
          typeof handler !== 'function'
        ) {
          console.error(
            'withHandlers(): Expected a map of higher-order functions. ' +
            'Refer to the docs for more info.'
          )
        }

        return handler(...args)
      }
    )

    return {
      update: (props, cb) => {
        cachedHandlers = {}
        next.update({
          ...props,
          ...handlerProps
        }, cb)
      }
    }
  })

export default createHelper(withHandlers, 'withHandlers')
