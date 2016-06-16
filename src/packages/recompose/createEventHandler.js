import $$observable from 'symbol-observable'
import { createChangeEmitter } from 'change-emitter'
import { fromESObservable } from './setObservableConfig'

const createEventHandler = () => {
  const emitter = createChangeEmitter()
  const stream = fromESObservable({
    subscribe(observer) {
      const unsubscribe = emitter.listen(value => observer.next(value))
      return { unsubscribe }
    },
    [$$observable]() {
      return this
    }
  })
  return {
    handler: emitter.emit,
    stream
  }
}

export default createEventHandler
