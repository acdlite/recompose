import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const withContext = (childContextTypes, getChildContext) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  class WithContext extends Component {
    getChildContext = () => getChildContext(this.props)

    render() {
      return factory(this.props)
    }
  }

  WithContext.childContextTypes = childContextTypes

  return WithContext
}

export default createHelper(withContext, 'withContext')
