import { Component } from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const withContext = (childContextTypes, getChildContext) => BaseComponent => {
  class WithContext extends Component {
    getChildContext = () => getChildContext(this.props);

    render() {
      return createElement(BaseComponent, this.props)
    }
  }

  WithContext.childContextTypes = childContextTypes

  return WithContext
}

export default createHelper(withContext, 'withContext')
