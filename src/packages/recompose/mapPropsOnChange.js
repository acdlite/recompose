import { Component } from 'react'
import pick from 'lodash/object/pick'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import createElement from './createElement'

const mapPropsOnChange = (depdendentPropKeys, propsMapper, BaseComponent) => {
  const pickDependentProps = props => pick(props, depdendentPropKeys)

  return class extends Component {
    childProps = propsMapper(this.props)

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(
        pickDependentProps(this.props),
        pickDependentProps(nextProps)
      )) {
        this.childProps = propsMapper(nextProps)
      }
    }

    render() {
      return createElement(BaseComponent, this.childProps)
    }
  }
}

export default createHelper(mapPropsOnChange, 'mapPropsOnChange')
