import { Component } from 'react'
import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const shouldUpdate = test => BaseComponent => {
  const createElement = curriedCreateElement(BaseComponent)
  return class extends Component {
    shouldComponentUpdate(nextProps) {
      return test(this.props, nextProps)
    }

    render() {
      return createElement(this.props)
    }
  }
}

export default createHelper(shouldUpdate, 'shouldUpdate')
