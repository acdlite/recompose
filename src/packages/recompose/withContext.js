import { Component } from 'react'
import createHelper from './createHelper'
import createElement from './createElement'

const withContext = (
  childContextTypes,
  getChildContext,
  BaseComponent
) => {
  const NewComponent = class extends Component {
    getChildContext = () => getChildContext(this.props)

    render() {
      return createElement(BaseComponent, this.props)
    }
  }
  NewComponent.childContextTypes = childContextTypes

  return NewComponent
}

export default createHelper(withContext, 'withContext')
