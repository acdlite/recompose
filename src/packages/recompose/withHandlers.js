import { Component } from 'react'
import createEagerFactory from './createEagerFactory'
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

const withHandlers = handlers => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return class extends Component {
    cachedHandlers = {};

    handlers = mapValues(
      handlers,
      (createHandler, handlerName) => (...args) => {
        const cachedHandler = this.cachedHandlers[handlerName]
        if (cachedHandler) {
          return cachedHandler(...args)
        }

        const handler = createHandler(this.props)
        this.cachedHandlers[handlerName] = handler

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
    );

    componentWillReceiveProps() {
      this.cachedHandlers = {}
    }

    render() {
      return factory({
        ...this.props,
        ...this.handlers
      })
    }
  }
}

export default createHelper(withHandlers, 'withHandlers')
