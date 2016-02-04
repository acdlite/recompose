import { Observable } from 'rxjs/Observable';

// Idea and implementation borrowed from
// https://github.com/fdecampredon/rx-react
const createEventHandler = () => {
  let observer

  function observable(value) {
    observer.next(value)
  }

  /* eslint-disable */
  for (let key in Observable.prototype) {
  /* eslint-enable */
    observable[key] = Observable.prototype[key]
  }

  Observable.call(observable, o => {
    observer = o
    return () => {}
  })

  return observable
}

export default createEventHandler
