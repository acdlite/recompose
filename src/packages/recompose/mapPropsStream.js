import { createFactory } from 'react'
import $$observable from 'symbol-observable'
import { componentFromStreamWithConfig } from './componentFromStream'
import { config as globalConfig } from './setObservableConfig'
import composeWithDisplayName from './composeWithDisplayName'

const identity = t => t

export const mapPropsStreamWithConfig = config => {
  const componentFromStream = componentFromStreamWithConfig({
    fromESObservable: identity,
    toESObservable: identity,
  })
  return transform => BaseComponent => {
    const factory = createFactory(BaseComponent)
    const { fromESObservable, toESObservable } = config
    return componentFromStream(props$ => ({
      subscribe(observer) {
        const subscription = toESObservable(
          transform(fromESObservable(props$))
        ).subscribe({
          next: childProps => observer.next(factory(childProps)),
        })
        return {
          unsubscribe: () => subscription.unsubscribe(),
        }
      },
      [$$observable]() {
        return this
      },
    }))
  }
}

const mapPropsStream = transform => {
  const hoc = mapPropsStreamWithConfig(globalConfig)(transform)
  return composeWithDisplayName('mapPropsStream', hoc)
}

export default mapPropsStream
