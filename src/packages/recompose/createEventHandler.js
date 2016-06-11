import { createChangeEmitter } from 'change-emitter'

const createEventHandler = () => {
  const emitter = createChangeEmitter()
  const stream = new Observable(observer =>
    emitter.listen(value => observer.next(value))
  )
  return {
    handler: emitter.emit,
    stream
  }
}

export default createEventHandler
