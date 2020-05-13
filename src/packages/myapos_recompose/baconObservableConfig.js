import $$observable from 'symbol-observable'
import Bacon from 'baconjs'

const config = {
  fromESObservable: observable =>
    Bacon.fromBinder(sink => {
      const { unsubscribe } = observable.subscribe({
        next: val => sink(new Bacon.Next(val)),
        error: err => sink(new Bacon.Error(err)),
        complete: () => sink(new Bacon.End()),
      })
      return unsubscribe
    }),
  toESObservable: stream => ({
    subscribe: observer => {
      const unsubscribe = stream.subscribe(event => {
        if (event.hasValue()) {
          observer.next(event.value())
        } else if (event.isError()) {
          observer.error(event.error)
        } else if (event.isEnd()) {
          observer.complete()
        }
      })
      return { unsubscribe }
    },
    [$$observable]() {
      return this
    },
  }),
}

export default config
