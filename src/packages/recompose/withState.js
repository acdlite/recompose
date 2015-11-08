import { Component } from 'react'
import curry from 'lodash/function/curry'
import isFunction from 'lodash/lang/isFunction'
import wrapDisplayName from './wrapDisplayName'
import createElement from './createElement'

export const withState = (
  stateName,
  stateUpdaterName,
  initialState,
  BaseComponent
) => (
  class extends Component {
    static displayName = wrapDisplayName(BaseComponent, 'withState')
    state = {
      stateValue: isFunction(initialState)
        ? initialState(this.props)
        : initialState
    }

    updateStateValue = (updateFn, callback) => (
      this.setState(({ stateValue }) => ({
        stateValue: isFunction(updateFn) ? updateFn(stateValue) : updateFn
      }), callback)
    )

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        [stateName]: this.state.stateValue,
        [stateUpdaterName]: this.updateStateValue
      })
    }
  }
)

export default curry(withState)
