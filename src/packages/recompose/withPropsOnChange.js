import { Component } from 'react'
import pick from './utils/pick'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const withPropsOnChange = (shouldMapOrKeys, propsMapper) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const shouldMap = typeof shouldMapOrKeys === 'function'
    ? shouldMapOrKeys
    : (props, nextProps) =>
        !shallowEqual(
          pick(props, shouldMapOrKeys),
          pick(nextProps, shouldMapOrKeys)
        )

  return class extends Component {
    computedProps = propsMapper(this.props)

    componentWillReceiveProps(nextProps) {
      if (shouldMap(this.props, nextProps)) {
        this.computedProps = propsMapper(nextProps)
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.computedProps,
      })
    }
  }
}

export default createHelper(withPropsOnChange, 'withPropsOnChange')
