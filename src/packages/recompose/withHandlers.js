/* eslint-disable no-console */
import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const withHandlers = handlers => BaseComponent => {
  const factory = createFactory(BaseComponent)
  class WithHandlers extends Component {
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

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(
      WithHandlers
    )
  }
  return WithHandlers
}

export default withHandlers
