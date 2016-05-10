import { Component } from 'react'
import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const withState = (stateName, stateUpdaterName, initialState) =>
  BaseComponent => {
    const createElement = internalCreateElement(BaseComponent)
    return class extends Component {
      state = {
        stateValue: typeof initialState === 'function'
          ? initialState(this.props)
          : initialState
      };

      updateStateValue = (updateFn, callback) => (
        this.setState(({ stateValue }) => ({
          stateValue: typeof updateFn === 'function'
            ? updateFn(stateValue)
            : updateFn
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
