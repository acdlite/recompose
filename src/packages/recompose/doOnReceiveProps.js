import { Component } from 'react'
import { internalCreateElement } from './createElement'
import createHelper from './createHelper'

const doOnReceiveProps = callback => BaseComponent => {
  const createElement = internalCreateElement(BaseComponent)

  return class extends Component {
    componentWillMount() {
      callback(null, this.props)
    }

    componentWillReceiveProps(nextProps) {
      callback(this.props, nextProps)
    }

    render() {
      return createElement(this.props)
    }
  }
}

export default createHelper(doOnReceiveProps, 'doOnReceiveProps')
