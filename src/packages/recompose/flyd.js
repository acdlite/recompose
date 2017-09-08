import $$observable from 'symbol-observable'
import flyd from 'flyd'
import componentFromStreamWithConfig from './componentFromStreamWithConfig'
import mapPropsStreamWithConfig from './mapPropsStreamWithConfig'
import createEventHandlerWithConfig from './createEventHandlerWithConfig'

const noop = () => {}

export const config = {
  fromESObservable: observable => {
    const stream = flyd.stream()
    const { unsubscribe } = observable.subscribe({
      next: value => stream(value),
      error: error => stream({ error }),
      complete: () => stream.end(true),
    })

    flyd.on(unsubscribe, stream.end)
    return stream
  },

  toESObservable: stream => ({
    subscribe: observer => {
      const sub = flyd.on(observer.next || noop, stream)
      flyd.on(_ => observer.complete(), sub.end)
      return {
        unsubscribe: () => sub.end(true),
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
