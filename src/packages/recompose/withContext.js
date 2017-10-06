import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const withContext = (childContextTypes, getChildContext) => BaseComponent => {
  const factory = createFactory(BaseComponent)
  class WithContext extends Component {
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
