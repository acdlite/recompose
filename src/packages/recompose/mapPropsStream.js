import $$observable from 'symbol-observable'
import createEagerFactory from './createEagerFactory'
import createHelper from './createHelper'
import { componentFromStreamWithConfig } from './componentFromStream'
import { config as globalConfig } from './setObservableConfig'

const identity = t => t
const componentFromStream = componentFromStreamWithConfig({
  fromESObservable: identity,
  toESObservable: identity
})

export const mapPropsStreamWithConfig = config => transform =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    const { fromESObservable, toESObservable } = config
    return componentFromStream(props$ => ({
      subscribe(observer) {
        const subscription = toESObservable(transform(fromESObservable(props$)))
          .subscribe({
            next: childProps => observer.next(factory(childProps))
          })
        return {
          unsubscribe: () => subscription.unsubscribe()
        }
      },
      [$$observable]() {
        return this
      }
    }))
  }

const mapPropsStream = mapPropsStreamWithConfig(globalConfig)

export default createHelper(mapPropsStream, 'mapPropsStream')
