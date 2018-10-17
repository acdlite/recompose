/* eslint-disable no-console */
import { createFactory, Component } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const lifecycle = spec =>
  composeWithDisplayName('lifecycle', BaseComponent => {
    const factory = createFactory(BaseComponent)

    if (
      process.env.NODE_ENV !== 'production' &&
      spec.hasOwnProperty('render')
    ) {
      console.error(
        'lifecycle() does not support the render method; its behavior is to ' +
          'pass all props and state to the base component.'
      )
    }

    class Lifecycle extends Component {
      render() {
        return factory({
          ...this.props,
          ...this.state,
        })
      }
    }

    Object.keys(spec).forEach(hook => (Lifecycle.prototype[hook] = spec[hook]))

    return Lifecycle
  })

export default lifecycle
