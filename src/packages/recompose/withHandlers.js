/* eslint-disable no-console */
import { Component } from 'react'
import createEagerFactory from './createEagerFactory'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const withHandlers = handlers => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  class WithHandlers extends Component {
    cachedHandlers = {}

    handlers = mapValues(
      typeof handlers === 'function' ? handlers(this.props) : handlers,
      (createHandler, handlerName) => (...args) => {
        const cachedHandler = this.cachedHandlers[handlerName]
        if (cachedHandler) {
          return cachedHandler(...args)
        }

        const handler = createHandler(this.props, this.handlers)
        this.cachedHandlers[handlerName] = handler

        if (
          process.env.NODE_ENV !== 'production' &&
          typeof handler !== 'function'
        ) {
          console.error(
            // eslint-disable-line no-console
            'withHandlers(): Expected a map of higher-order functions. ' +
              'Refer to the docs for more info.'
          )
        }

        return handler(...args)
      }
    )

    componentWillReceiveProps() {
      this.cachedHandlers = {}
    }

    render() {
      return factory({
        ...this.props,
        ...this.handlers,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(
      WithHandlers
    )
  }
  return WithHandlers
}

export default withHandlers
