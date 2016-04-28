import { Component } from 'react'
import isFunction from 'lodash/isFunction'
import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const withReducer = (stateName, dispatchName, reducer, initialState) =>
  BaseComponent => {
    const createElement = curriedCreateElement(BaseComponent)
    return class extends Component {
      state = {
        stateValue: isFunction(initialState)
          ? initialState(this.props)
          : initialState
      };

      dispatch = action => this.setState(({ stateValue }) => ({
        stateValue: reducer(stateValue, action)
      }));

      render() {
        return createElement({
          ...this.props,
          [stateName]: this.state.stateValue,
          [dispatchName]: this.dispatch
        })
      }
    }
  }

export default createHelper(withReducer, 'withReducer')
