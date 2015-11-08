import React from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const lifecycle = (setup, teardown, BaseComponent) => (
  class Lifecycle extends React.Component {
    constructor(props, context) {
      super(props, context)
      setup(this)
    }

    componentWillUnmount() {
      teardown(this)
    }

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        ...this.state
      })
    }
  }
)

export default createHelper(lifecycle, 'lifecycle')
