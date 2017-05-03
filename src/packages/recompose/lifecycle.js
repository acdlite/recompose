/* eslint-disable no-console */
import { Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const lifecycle = spec => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
    console.error(
      'lifecycle() does not support the render method; its behavior is to ' +
        'pass all props and state to the base component.'
    )
  }

  class Lifecycle extends Component {
    constructor(...args) {
      super(...args)

      Object.assign(this, spec)
    }

    render() {
      return factory({
        ...this.props,
        ...this.state,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(
      Lifecycle
    )
  }
  return Lifecycle
}

export default lifecycle
