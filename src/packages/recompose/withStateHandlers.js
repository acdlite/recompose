import { Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'
import shallowEqual from './shallowEqual'
import mapValues from './utils/mapValues'

const withStateHandlers = (initialState, stateUpdaters) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  class WithStateHandlers extends Component {
    state = typeof initialState === 'function'
      ? initialState(this.props)
      : initialState

    stateUpdaters = mapValues(stateUpdaters, handler => (...args) =>
      this.setState((state, props) => handler(state, props)(...args))
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
