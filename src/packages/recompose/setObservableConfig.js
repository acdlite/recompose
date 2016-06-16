let config = {
  fromObservable: null,
  toObservable: null
}

export const fromObservable = observable =>
  typeof config.fromObservable === 'function'
    ? config.fromObservable(observable)
    : observable

export const toObservable = stream =>
  typeof config.toObservable === 'function'
    ? config.toObservable(stream)
    : stream

const configureObservable = c => {
  config = c
}

export default configureObservable
