import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const withReducer = (stateName, dispatchName, reducer, initialState) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    return class extends Component {
      state = {
        stateValue: typeof initialState === 'function'
          ? initialState(this.props)
          : initialState
      };

      dispatch = action => this.setState(({ stateValue }) => ({
        stateValue: reducer(stateValue, action)
      }));

      render() {
        return factory({
          ...this.props,
          [stateName]: this.state.stateValue,
          [dispatchName]: this.dispatch
        })
      }
    }
  }

export default createHelper(withReducer, 'withReducer')
