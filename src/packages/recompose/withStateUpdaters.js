import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const withStateUpdaters = (initialState, stateUpdaters) => BaseComponent => {
  const factory = createFactory(BaseComponent)

  class WithStateUpdaters extends Component {
    state =
      typeof initialState === 'function'
        ? initialState(this.props)
        : initialState

    stateUpdaters = mapValues(stateUpdaters, getUpdater => (...args) => {
      this.setState(getUpdater(...args))
    })

    render() {
      return factory({
        ...this.props,
        ...this.state,
        ...this.stateUpdaters,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withStateUpdaters'))(
      WithStateUpdaters
    )
  }
  return WithStateUpdaters
}

export default withStateUpdaters
