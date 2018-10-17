import { createFactory, Component } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const withContext = (childContextTypes, getChildContext) =>
  composeWithDisplayName('withContext', BaseComponent => {
    const factory = createFactory(BaseComponent)
    class WithContext extends Component {
      getChildContext = () => getChildContext(this.props)

      render() {
        return factory(this.props)
      }
    }

    WithContext.childContextTypes = childContextTypes

    return WithContext
  })

export default withContext
