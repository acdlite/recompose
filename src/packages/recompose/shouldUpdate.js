import { Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const shouldUpdate = test => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
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
