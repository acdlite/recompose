import { Component } from 'react'

const createSink = callback =>
  class Sink extends Component {
    componentWillMount() {
      callback(this.props)
    }

    componentWillReceiveProps(nextProps) {
      callback(nextProps)
    }

    render() {
      return null
    }
  }

export default createSink
