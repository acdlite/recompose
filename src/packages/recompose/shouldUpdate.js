import { Component } from 'react'
import curry from 'lodash/function/curry'
import wrapDisplayName from './wrapDisplayName'
import createElement from './createElement'

const shouldUpdate = (test, BaseComponent) => (
  class extends Component {
    static displayName = wrapDisplayName(BaseComponent, 'shouldUpdate')

    shouldComponentUpdate(nextProps) {
      return test(this.props, nextProps)
    }

    render() {
      return createElement(BaseComponent, this.props)
    }
  }
)

export default curry(shouldUpdate)
