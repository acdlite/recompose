import { Component } from 'react'
import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const shouldUpdate = test => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)
  return class extends Component {
    shouldComponentUpdate(nextProps, nextState) {
      return test(this.props, nextProps, this.state, nextState)
    }

    render() {
      return createElement(this.props)
    }
  }
}

export default createHelper(shouldUpdate, 'shouldUpdate')
