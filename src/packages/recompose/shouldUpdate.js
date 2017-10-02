import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const shouldUpdate = test => BaseComponent => {
  const factory = createFactory(BaseComponent)
  class ShouldUpdate extends Component {
    shouldComponentUpdate(nextProps) {
      return test(this.props, nextProps)
    }

    render() {
      return factory(this.props)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'shouldUpdate'))(
      ShouldUpdate
    )
  }
  return ShouldUpdate
}

export default shouldUpdate
