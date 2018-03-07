import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const noop = () => {}

const withReducer = (
  stateName,
  dispatchName,
  reducer,
  initialState
) => BaseComponent => {
  const factory = createFactory(BaseComponent)
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

    dispatch = (action, callback = noop) =>
      this.setState(
        ({ stateValue }) => ({
          stateValue: reducer(stateValue, action),
        }),
        () => callback(this.state.stateValue)
      )

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
