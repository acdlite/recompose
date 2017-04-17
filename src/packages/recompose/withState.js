import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const withStateOriginal = (stateName, stateUpdaterName, initialState) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
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
        return factory({
          ...this.props,
          [stateName]: this.state.stateValue,
          [stateUpdaterName]: this.updateStateValue
        })
      }
    }
  }

const withClasslikeState = (initialState) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    return class extends Component {
      state = typeof initialState === 'function'
        ? initialState(this.props)
        : initialState

      setStateFn = (...args) => {
        this.setState(...args)
      }

      render() {
        return factory({
          ...this.props,
          state: this.state,
          setState: this.setStateFn
        })
      }
    }
  }

const withState = (...args) => {
  if (args.length === 1) {
    return withClasslikeState(...args)
  }

  return withStateOriginal(...args)
}

export default createHelper(withState, 'withState')
