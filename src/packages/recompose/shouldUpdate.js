import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const shouldUpdate = test => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return class extends Component {
    shouldComponentUpdate(nextProps) {
      return test(this.props, nextProps)
    }

    render() {
      return factory(this.props)
    }
  }
}

export default createHelper(shouldUpdate, 'shouldUpdate')
