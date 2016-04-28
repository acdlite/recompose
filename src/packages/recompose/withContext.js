import { Component } from 'react'
import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const withContext = (childContextTypes, getChildContext) => BaseComponent => {
  const createElement = curriedCreateElement(BaseComponent)
  class WithContext extends Component {
    getChildContext = () => getChildContext(this.props);

    render() {
      return createElement(this.props)
    }
  }

  WithContext.childContextTypes = childContextTypes

  return WithContext
}

export default createHelper(withContext, 'withContext')
