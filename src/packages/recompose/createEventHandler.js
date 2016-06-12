import $$observable from 'symbol-observable'
import { createChangeEmitter } from 'change-emitter'

const createEventHandler = () => {
  const emitter = createChangeEmitter()
  const stream = {
    subscribe(observer) {
      const unsubscribe = emitter.listen(value => observer.next(value))
      return { unsubscribe }
    },
    [$$observable]() {
      return this
    }
  }
  return {
    handler: emitter.emit,
    stream
  }
}

export default createEventHandler
