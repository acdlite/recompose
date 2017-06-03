import { Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const withPropState = (stateName, stateUpdaterName, initialState) => {
  return BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    class WithPropState extends Component {
      state = {
        stateValue: typeof initialState === 'function' ? initialState(this.props) : initialState,
      }

      componentWillReceiveProps(nextProps) {
        this.setState({ [stateName]: nextProps[stateName] })
      }

      updateStateValue = (updateFn, callback) =>
        this.setState(
          ({ stateValue }) => ({
            stateValue: typeof updateFn === 'function' ? updateFn(stateValue) : updateFn,
          }),
          callback,
        )

      render() {
        return factory({
          ...this.props,
          [stateName]: this.state.stateValue,
          [stateUpdaterName]: this.updateStateValue,
        })
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withPropState'))(WithPropState)
    }

    return WithPropState
  }
}

export default withPropState
