import { createFactory, Component } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const withState = (stateName, stateUpdaterName, initialState) =>
  composeWithDisplayName('withState', BaseComponent => {
    const factory = createFactory(BaseComponent)
    return class WithState extends Component {
      state = {
        stateValue:
          typeof initialState === 'function'
            ? initialState(this.props)
            : initialState,
      }

      updateStateValue = (updateFn, callback) =>
        this.setState(
          ({ stateValue }) => ({
            stateValue:
              typeof updateFn === 'function' ? updateFn(stateValue) : updateFn,
          }),
          callback
        )

      render() {
        return factory({
          ...this.props,
          [stateName]: this.state.stateValue,
          [stateUpdaterName]: this.updateStateValue,
        })
      }
    }
  })

export default withState
