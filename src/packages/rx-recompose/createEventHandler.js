import { Subject } from 'rx'

// Idea and implementation borrowed from
// https://github.com/fdecampredon/rx-react
const createEventHandler = (fn) => {
  function subject(value) {
    subject.onNext(value)
    // Call the function with the value (maybe event)
    // to allow canceling it, and `return false`-ing
    return fn && fn(value)
  }

  /* eslint-disable */
  for (let key in Subject.prototype) {
  /* eslint-enable */
    subject[key] = Subject.prototype[key]
  }

  Subject.call(subject)

  return subject
}

export default createEventHandler
