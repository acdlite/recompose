/* eslint-disable no-console */
import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const lifecycle = spec => BaseComponent => {
  const factory = createFactory(BaseComponent)
  const specIsFn = typeof spec === 'function'

  class LifecycleFnWrapper extends Component {
    render() {
      return factory({
        ...this.props,
        ...this.state,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
    console.error(
      'lifecycle() does not support the render method; its behavior is to ' +
        'pass all props and state to the base component.'
    )
  }

  class Lifecycle extends Component {
    setFactory() {
      // if the spec that was passed in is a function that
      // returns the spec for lifecycle methods, use thewrapper
      // component for the BaseComponent, otherwise use the BaseComonent
      if (specIsFn) {
        const wrapperSpec = spec(this.props)
        Object.keys(wrapperSpec).forEach(hook => {
          LifecycleFnWrapper.prototype[hook] = wrapperSpec[hook]
        })
        this.factoryToUse = createFactory(LifecycleFnWrapper)
      } else {
        this.factoryToUse = factory
      }
    }
    render() {
      if (!this.factoryToUse) {
        this.setFactory()
      }
      return this.factoryToUse({
        ...this.props,
        ...this.state,
      })
    }
  }

  // if the spec we got was a normal object, attach the hooks here
  if (!specIsFn) {
    Object.keys(spec).forEach(hook => {
      Lifecycle.prototype[hook] = spec[hook]
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(
      Lifecycle
    )
  }
  return Lifecycle
}

export default lifecycle
