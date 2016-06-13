let config = {
  fromObservable: null,
  toObservable: null
}

export const fromObservable = observable =>
  typeof config.fromObservable === 'function'
    ? config.fromObservable(Observable)
    : observable

export const toObservable = stream =>
  typeof config.toObservable === 'function'
    ? config.fromObservable(stream)
    : stream

const configureObservable = c => {
  config = { ...config, ...c }
}

export default configureObservable
