/* eslint-disable no-console */
import { createFactory, Component } from 'react'
import mapValues from './utils/mapValues'
import composeWithDisplayName from './composeWithDisplayName'

const withHandlers = handlers =>
  composeWithDisplayName('withHandlers', BaseComponent => {
    const factory = createFactory(BaseComponent)
    return class WithHandlers extends Component {
      handlers = mapValues(
        typeof handlers === 'function' ? handlers(this.props) : handlers,
        createHandler => (...args) => {
          const handler = createHandler(this.props)

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

      render() {
        return factory({
          ...this.props,
          ...this.handlers,
        })
      }
    }
  })

export default withHandlers
