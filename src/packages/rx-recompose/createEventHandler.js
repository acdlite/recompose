import { Observable } from 'rx'
import { createChangeEmitter } from 'change-emitter'

const createEventHandler = (init = x => x) => {
  const emitter = createChangeEmitter()
  const stream = Observable.create(observer =>
    emitter.listen(value => observer.onNext(value))
  )
  return {
    handler: emitter.emit,
    stream: init(stream)
  }
}

export default createEventHandler
