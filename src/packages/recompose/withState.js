import { Component } from 'react'
import isFunction from 'lodash/lang/isFunction'
import createHelper from './createHelper'
import createElement from './createElement'

export const withState = (
  stateName,
  stateUpdaterName,
  initialState,
  BaseComponent
) =>
  class extends Component {
    state = {
      stateValue: isFunction(initialState)
        ? initialState(this.props)
        : initialState
    }

    hasUnmounted = false

    updateStateValue = (updateFn, callback) => (
      !this.hasUnmounted &&
        this.setState(({ stateValue }) => ({
          stateValue: isFunction(updateFn) ? updateFn(stateValue) : updateFn
        }), callback)
    )

    componentWillUnmount() {
      this.hasUnmounted = true
    }

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        [stateName]: this.state.stateValue,
        [stateUpdaterName]: this.updateStateValue
      })
    }
  }

export default createHelper(withState, 'withState')
