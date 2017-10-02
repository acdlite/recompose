import { createFactory } from 'react'
import $$observable from 'symbol-observable'
import { componentFromStreamWithConfig } from './componentFromStream'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import { config as globalConfig } from './setObservableConfig'

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

  if (process.env.NODE_ENV !== 'production') {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(
        hoc(BaseComponent)
      )
  }
  return hoc
}

export default mapPropsStream
