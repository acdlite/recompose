import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import shallowEqual from './shallowEqual'
import mapValues from './utils/mapValues'

const withStateHandlers = (initialState, stateUpdaters) => BaseComponent => {
  const factory = createFactory(BaseComponent)

  class WithStateHandlers extends Component {
    state = typeof initialState === 'function'
      ? initialState(this.props)
      : initialState

    stateUpdaters = mapValues(
      stateUpdaters,
      handler => (mayBeEvent, ...args) => {
        // Having that functional form of setState can be called async
        // we need to persist SyntheticEvent
        if (mayBeEvent && typeof mayBeEvent.persist === 'function') {
          mayBeEvent.persist()
        }

        this.setState((state, props) =>
          handler(state, props)(mayBeEvent, ...args)
        )
      }
    )

    shouldComponentUpdate(nextProps, nextState) {
      const propsChanged = nextProps !== this.props
      // the idea is to skip render if stateUpdater handler return undefined
      // this allows to create no state update handlers with access to state and props
      const stateChanged = !shallowEqual(nextState, this.state)
      return propsChanged || stateChanged
    }

    render() {
      return factory({
        ...this.props,
        ...this.state,
        ...this.stateUpdaters,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withStateHandlers'))(
      WithStateHandlers
    )
  }
  return WithStateHandlers
}

export default withStateHandlers
