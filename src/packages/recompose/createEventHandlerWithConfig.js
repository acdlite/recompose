import $$observable from 'symbol-observable'
import { createChangeEmitter } from 'change-emitter'

const createEventHandlerWithConfig = config => {
  const emitter = createChangeEmitter()
  const stream = config.fromESObservable({
    subscribe(observer) {
      const unsubscribe = emitter.listen(value => observer.next(value))
      return { unsubscribe }
    },
    [$$observable]() {
      return this
    },
  })
  return {
    handler: emitter.emit,
    stream,
  }
}

export default createEventHandlerWithConfig
