import xstream from 'xstream'

const noop = () => {}

const config = {
  fromObservable: observable => xstream.create({
    subscription: null,
    start(listener) {
      this.subscription = observable.subscribe(listener)
    },
    stop() {
      this.subscription.unsubscribe()
    }
  }),
  toObservable: stream => ({
    subscribe: observer => {
      const listener = {
        next: observer.next || noop,
        error: observer.error || noop,
        complete: observer.complete || noop
      }
      stream.addListener(listener)
      return {
        unsubscribe: () => stream.removeListener(listener)
      }
    }
  })
}

export default config
