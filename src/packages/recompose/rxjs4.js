import $$observable from 'symbol-observable'
import Rx from 'rx'
import componentFromStreamWithConfig from './componentFromStreamWithConfig'
import mapPropsStreamWithConfig from './mapPropsStreamWithConfig'
import createEventHandlerWithConfig from './createEventHandlerWithConfig'

const config = {
  fromESObservable: observable =>
    Rx.Observable.create(observer => {
      const { unsubscribe } = observable.subscribe({
        next: val => observer.onNext(val),
        error: error => observer.onError(error),
        complete: () => observer.onCompleted(),
      })
      return unsubscribe
    }),
  toESObservable: rxObservable => ({
    subscribe: observer => {
      const subscription = rxObservable.subscribe(
        val => observer.next(val),
        error => observer.error(error),
        () => observer.complete()
      )
      return { unsubscribe: () => subscription.dispose() }
    },
    [$$observable]() {
      return this
    },
  }),
}

export const componentFromStream = propsToVdom =>
  componentFromStreamWithConfig(config)(propsToVdom)

export const mapPropsStream = transform =>
  mapPropsStreamWithConfig(config)(transform)

export const createEventHandler = () => createEventHandlerWithConfig(config)
