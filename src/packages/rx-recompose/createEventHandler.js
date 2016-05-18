import { Observable } from 'rxjs'
import { createChangeEmitter } from 'change-emitter'

const createEventHandler = () => {
  const emitter = createChangeEmitter()
  const stream = Observable.create(observer =>
    emitter.listen(value => observer.next(value))
  )
  return {
    handler: emitter.emit,
    stream
  }
}

export default createEventHandler
