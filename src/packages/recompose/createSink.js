import { Component } from 'react'
import { polyfill } from 'react-lifecycles-compat'

const createSink = callback => {
  class Sink extends Component {
    state = {}

    static getDerivedStateFromProps(nextProps) {
      callback(nextProps)
      return null
    }

    render() {
      return null
    }
  }

  polyfill(Sink)
  return Sink
}

export default createSink
