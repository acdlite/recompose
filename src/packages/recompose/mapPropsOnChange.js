import { Component } from 'react'
import pick from 'lodash/object/pick'
import omit from 'lodash/object/omit'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createElement from './createElement'

const mapPropsOnChange = (depdendentPropKeys, propsMapper, BaseComponent) => {
  const pickDependentProps = props => pick(props, depdendentPropKeys)

  return class extends Component {
    computedProps = propsMapper(this.props);

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(
        pickDependentProps(this.props),
        pickDependentProps(nextProps)
      )) {
        this.computedProps = propsMapper(nextProps)
      }
    }

    render() {
      return createElement(BaseComponent, {
        ...this.computedProps,
        ...omit(this.props, depdendentPropKeys)
      })
    }
  }
}

export default createHelper(mapPropsOnChange, 'mapPropsOnChange')
