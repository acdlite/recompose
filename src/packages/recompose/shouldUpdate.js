import { Component } from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const shouldUpdate = test => BaseComponent =>
  class extends Component {
    shouldComponentUpdate(nextProps) {
      return test(this.props, nextProps)
    }

    render() {
      return createElement(BaseComponent, this.props)
    }
  }

export default createHelper(shouldUpdate, 'shouldUpdate')
