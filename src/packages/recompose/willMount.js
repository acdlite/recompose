import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const willMount = (onMount) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    return class extends Component {
      componentWillMount() {
        return onMount(this.props)
      }
      render() {
        return factory({
          ...this.props
        })
      }
    }
  }

export default createHelper(willMount, 'willMount')
