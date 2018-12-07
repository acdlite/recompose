import { createFactory, Component } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const noop = () => {}

const withReducer = (stateName, dispatchName, reducer, initialState) =>
  composeWithDisplayName('withReducer', BaseComponent => {
    const factory = createFactory(BaseComponent)
    return class WithReducer extends Component {
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
  })

export default withReducer
