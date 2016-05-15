import { createClass } from 'react'
import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const lifecycle = spec => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)

  if (
    process.env.NODE_ENV !== 'production' &&
    spec.hasOwnProperty('render')
  ) {
    console.error(
      'lifecycle() does not support the render method; its behavior is to ' +
      'pass all props and state to the base component.'
    )
  }

  return createClass({
    ...spec,
    render() {
      return createElement({
        ...this.props,
        ...this.state
      })
    }
  })
}

export default createHelper(lifecycle, 'lifecycle')
