/* eslint-disable no-console */
import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const ActualLifecycles = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'componentDidCatch',
  'getSnapshotBeforeUpdate',
  'componentDidCatch',
  'getDerivedStateFromProps',
]

const validateLifecycles = spec => {
  const invalidEntries = Object.keys(spec).filter(
    lc => !ActualLifecycles.includes(lc)
  )
  return { validLifecycles: invalidEntries.length === 0, invalidEntries }
}

const lifecycle = spec => BaseComponent => {
  const factory = createFactory(BaseComponent)
  const { validLifecycles, invalidEntries } = validateLifecycles(spec)

  if (process.env.NODE_ENV !== 'production' && !validLifecycles) {
    console.error(`Invalid lifecycle entries: ${invalidEntries.join(',')}.`)
  }

  if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
    console.error(
      'lifecycle() does not support the render method; its behavior is to ' +
        'pass all props and state to the base component.'
    )
  }

  class Lifecycle extends Component {
    render() {
      return factory({
        ...this.props,
        ...this.state,
      })
    }
  }

  Object.keys(spec).forEach(hook => {
    const currentLifecycle = spec[hook]
    Lifecycle.prototype[hook] = function hookFn(...hookArgs) {
      return currentLifecycle(this.props).apply(this, hookArgs)
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(
      Lifecycle
    )
  }
  return Lifecycle
}

export default lifecycle
