import { Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import { createFactory } from './utils/factory'

const withContext = (childContextTypes, getChildContext) => (BaseComponent) => {
  const factory = createFactory(BaseComponent)
  class WithContext extends Component {
    // eslint-disable-next-line react/no-arrow-function-lifecycle
    getChildContext = () => getChildContext(this.props)

    render() {
      return factory(this.props)
    }
  }

  WithContext.childContextTypes = childContextTypes

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(
      WithContext
    )
  }
  return WithContext
}

export default withContext
