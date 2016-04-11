import { Component } from 'react'
import mapValues from 'lodash/mapValues'
import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'

const withHandlers = handlers => BaseComponent =>
  class extends Component {
    handlers = mapValues(
      handlers,
      createHandler => (...args) => {
        const handler = createHandler(this.props)

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

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        ...this.handlers
      })
    }
  }

export default createHelper(withHandlers, 'withHandlers')
