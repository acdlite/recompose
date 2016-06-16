let config = {
  fromESObservable: null,
  toESObservable: null
}

export const fromESObservable = observable =>
  typeof config.fromESObservable === 'function'
    ? config.fromESObservable(observable)
    : observable

export const toESObservable = stream =>
  typeof config.toESObservable === 'function'
    ? config.toESObservable(stream)
    : stream

const configureObservable = c => {
  config = c
}

export default configureObservable
