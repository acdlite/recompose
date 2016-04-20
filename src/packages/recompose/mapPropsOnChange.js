import { Component } from 'react'
import pick from 'lodash/pick'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createElement from './createElement'

const mapPropsOnChange = (shouldMapOrKeys, propsMapper) => BaseComponent => {
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
      return createElement(BaseComponent, this.computedProps)
    }
  }
}

export default createHelper(mapPropsOnChange, 'mapPropsOnChange')
