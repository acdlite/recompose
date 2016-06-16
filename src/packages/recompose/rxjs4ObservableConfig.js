import Rx from 'rx'

const config = {
  fromESObservable: observable => Rx.Observable.create(observer => {
    const { unsubscribe } = observable.subscribe({
      next: val => observer.onNext(val),
      error: error => observer.onError(error),
      complete: () => observer.onCompleted()
    })
    return unsubscribe
  }),
  toESObservable: rxObservable => ({
    subscribe: observer => {
      const { dispose } = rxObservable.subscribe(
        val => observer.next(val),
        error => observer.error(error),
        () => observer.complete()
      )
      return { unsubscribe: dispose }
    }
  })
}

export default config
