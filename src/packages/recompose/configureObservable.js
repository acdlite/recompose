const identity = t => t
let config = {
  fromObservable: identity,
  toObservable: identity
}

export const fromObservable = observable => config.fromObservable(observable)
export const toObservable = stream => config.toObservable(stream)

const configureObservable = c => {
  config = c
}

export default configureObservable
