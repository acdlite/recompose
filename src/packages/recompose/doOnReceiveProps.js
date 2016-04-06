import { Component } from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const doOnReceiveProps = callback => BaseComponent =>
  class extends Component {
    componentWillMount() {
      callback(this.props, null)
    }

    componentWillReceiveProps(nextProps) {
      callback(nextProps, this.props)
    }

    render() {
      return createElement(BaseComponent, this.props)
    }
  }

export default createHelper(doOnReceiveProps, 'doOnReceiveProps')
