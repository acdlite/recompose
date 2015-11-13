import { Component } from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const isMounted = (
  isMountedPropName,
  BaseComponent
) =>
  class extends Component {
    isMounted_ = false

    componentDidMount() {
      this.isMounted_ = true
    }

    componentWillUnmount() {
      this.isMounted_ = false
    }

    _isMounted = () => this.isMounted_

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        [isMountedPropName]: this._isMounted,
      })
    }
  }

export default createHelper(isMounted, 'isMounted')
