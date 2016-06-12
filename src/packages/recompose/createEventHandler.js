import $$observable from 'symbol-observable'
import { createChangeEmitter } from 'change-emitter'
import { getTransform } from './configureObservable'

const createEventHandler = () => {
  const emitter = createChangeEmitter()
  const transform = getTransform()
  const stream = transform({
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
