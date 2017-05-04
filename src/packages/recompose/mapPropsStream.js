import $$observable from 'symbol-observable'
import createEagerFactory from './createEagerFactory'
import createHelper from './createHelper'
import {
  componentFromStreamWithConfig,
  createObservableConfig,
} from './componentFromStream'
import { config as globalConfig } from './setObservableConfig'

const identity = t => t
const componentFromStream = componentFromStreamWithConfig({
  fromESObservable: identity,
  toESObservable: identity,
})

const mapPropsStreamWithConfigBase = config => transform => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const { fromESObservable, toESObservable } = createObservableConfig(config)

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

const mapPropsStream = mapPropsStreamWithConfigBase(globalConfig)

export const mapPropsStreamWithConfig = createHelper(
  mapPropsStreamWithConfigBase,
  'mapPropsStream'
)
export default createHelper(mapPropsStream, 'mapPropsStream')
