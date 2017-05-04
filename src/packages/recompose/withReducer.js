import { Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const withReducer = (
  stateName,
  dispatchName,
  reducer,
  initialState
) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  class WithReducer extends Component {
    state = {
      stateValue: this.initializeStateValue(),
    }

    initializeStateValue() {
      if (initialState !== undefined) {
        return typeof initialState === 'function'
          ? initialState(this.props)
          : initialState
      }
      return reducer(undefined, { type: '@@recompose/INIT' })
    }

    dispatch = action =>
      this.setState(({ stateValue }) => ({
        stateValue: reducer(stateValue, action),
      }))

    render() {
      return factory({
        ...this.props,
        [stateName]: this.state.stateValue,
        [dispatchName]: this.dispatch,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withReducer'))(
      WithReducer
    )
  }
  return WithReducer
}

export default withReducer
