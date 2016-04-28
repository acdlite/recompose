import { Component } from 'react'
import isFunction from 'lodash/isFunction'
import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const withState = (stateName, stateUpdaterName, initialState) =>
  BaseComponent => {
    const createElement = curriedCreateElement(BaseComponent)
    return class extends Component {
      state = {
        stateValue: isFunction(initialState)
          ? initialState(this.props)
          : initialState
      };

      updateStateValue = (updateFn, callback) => (
        this.setState(({ stateValue }) => ({
          stateValue: isFunction(updateFn) ? updateFn(stateValue) : updateFn
        }), callback)
      );

      render() {
        return createElement({
          ...this.props,
          [stateName]: this.state.stateValue,
          [stateUpdaterName]: this.updateStateValue
        })
      }
    }
  }

export default createHelper(withState, 'withState')
