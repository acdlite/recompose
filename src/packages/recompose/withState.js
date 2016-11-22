import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const withState = (stateName, stateUpdaterName, initialState, bind) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    return class extends Component {
      state = {
        stateValue: typeof initialState === 'function'
          ? initialState(this.props)
          : initialState
      };

      componentWillReceiveProps(nextProps) {
        if (bind && typeof initialState === 'function') {
          const newValue = initialState(nextProps);
          if (this.state.stateValue !== newValue) {
            this.setState({ stateValue: newValue });
          }
        }
      }
      
      updateStateValue = (updateFn, callback) => (
        this.setState(({ stateValue }) => ({
          stateValue: typeof updateFn === 'function'
            ? updateFn(stateValue)
            : updateFn
        }), callback)
      );

      render() {
        return factory({
          ...this.props,
          [stateName]: this.state.stateValue,
          [stateUpdaterName]: this.updateStateValue
        })
      }
    }
  }

export default createHelper(withState, 'withState')
