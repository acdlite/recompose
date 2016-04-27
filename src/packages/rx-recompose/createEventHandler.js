import { Observable } from 'rx'

const createEventHandler = () => {
  const observers = []
  const stream = Observable.create(observer => {
    observers.push(observer)
    return () => {
      const i = observers.indexOf(observer)
      observers.splice(i, 1)
    }
  })
  return {
    handler: value => observers.forEach(observer => observer.onNext(value)),
    stream
  }
}

export default createEventHandler
