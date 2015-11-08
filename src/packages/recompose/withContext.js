import { Component } from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const withContext = (
  childContextTypes,
  getChildContext,
  BaseComponent
) =>
  class extends Component {
    static childContextTypes = childContextTypes
    getChildContext = () => getChildContext(this.props)

    render() {
      return createElement(BaseComponent, this.props)
    }
  }

export default createHelper(withContext, 'withContext')
