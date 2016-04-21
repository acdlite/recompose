import { Component } from 'react'
import pick from 'lodash/pick'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createElement from './createElement'

const withPropsOnChange = (shouldMapOrKeys, propsMapper) => BaseComponent => {
  const shouldMap = typeof shouldMapOrKeys === 'function'
    ? shouldMapOrKeys
    : (props, nextProps) => !shallowEqual(
        pick(props, shouldMapOrKeys),
        pick(nextProps, shouldMapOrKeys),
      )

  return class extends Component {
    computedProps = propsMapper(this.props);

    componentWillReceiveProps(nextProps) {
      if (shouldMap(this.props, nextProps)) {
        this.computedProps = propsMapper(nextProps)
      }
    }

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        ...this.computedProps
      })
    }
  }
}

export default createHelper(withPropsOnChange, 'withPropsOnChange')
