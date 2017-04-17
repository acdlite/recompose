import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'
import shallowEqualForKeys from './utils/shallowEqualForKeys'

const withPropsOnChange = (shouldMapOrKeys, propsMapper) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const shouldMap = typeof shouldMapOrKeys === 'function'
    ? shouldMapOrKeys
    : (props, nextProps) =>
      !shallowEqualForKeys(shouldMapOrKeys, props, nextProps)

  return class extends Component {
    computedProps = propsMapper(this.props);

    componentWillReceiveProps(nextProps) {
      if (shouldMap(this.props, nextProps)) {
        this.computedProps = propsMapper(nextProps)
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.computedProps
      })
    }
  }
}

export default createHelper(withPropsOnChange, 'withPropsOnChange')
