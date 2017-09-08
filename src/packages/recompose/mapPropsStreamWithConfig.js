import $$observable from 'symbol-observable'
import createEagerFactory from './createEagerFactory'
import componentFromStreamWithConfig from './componentFromStreamWithConfig'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const identity = t => t

const mapPropsStreamWithConfig = config => {
  const componentFromStream = componentFromStreamWithConfig({
    fromESObservable: identity,
    toESObservable: identity,
  })
  return transform => BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    const { fromESObservable, toESObservable } = config
    const Enhanced = componentFromStream(props$ => ({
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
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(
        Enhanced
      )
    }
    return Enhanced
  }
}

export default mapPropsStreamWithConfig
