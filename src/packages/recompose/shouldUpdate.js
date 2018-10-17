import { createFactory, Component } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const shouldUpdate = test =>
  composeWithDisplayName('shouldUpdate', BaseComponent => {
    const factory = createFactory(BaseComponent)
    return class ShouldUpdate extends Component {
      shouldComponentUpdate(nextProps) {
        return test(this.props, nextProps)
      }

      render() {
        return factory(this.props)
      }
    }
  })

export default shouldUpdate
