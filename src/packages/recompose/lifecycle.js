import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const lifecycle = spec => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  if (
    process.env.NODE_ENV !== 'production' &&
    spec.hasOwnProperty('render')
  ) {
    console.error(
      'lifecycle() does not support the render method; its behavior is to ' +
      'pass all props and state to the base component.'
    )
  }

  return class extends Component {
    constructor(...args) {
      super(...args)

      Object.keys(spec).forEach(key => {
        this[key] = typeof spec[key] === 'function'
          ? spec[key].bind(this)
          : spec[key]
      })
    }

    render() {
      return factory({
        ...this.props,
        ...this.state
      })
    }
  }
}

export default createHelper(lifecycle, 'lifecycle')
