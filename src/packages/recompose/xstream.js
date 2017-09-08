import $$observable from 'symbol-observable'
import xstream from 'xstream'
import componentFromStreamWithConfig from './componentFromStreamWithConfig'
import mapPropsStreamWithConfig from './mapPropsStreamWithConfig'
import createEventHandlerWithConfig from './createEventHandlerWithConfig'

const noop = () => {}

export const config = {
  fromESObservable: observable =>
    xstream.create({
      subscription: null,
      start(listener) {
        this.subscription = observable.subscribe(listener)
      },
      stop() {
        this.subscription.unsubscribe()
      },
    }),
  toESObservable: stream => ({
    subscribe: observer => {
      const listener = {
        next: observer.next || noop,
        error: observer.error || noop,
        complete: observer.complete || noop,
      }
      stream.addListener(listener)
      return {
        unsubscribe: () => stream.removeListener(listener),
      }
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
