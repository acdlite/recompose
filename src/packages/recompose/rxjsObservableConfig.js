import Rx from 'rxjs'

const config = {
  fromESObservable: Rx.Observable.from,
  toESObservable: stream => stream,
}

export default config
