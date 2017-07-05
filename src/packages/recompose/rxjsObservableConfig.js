import { from } from 'rxjs/observable/from'

const config = {
  fromESObservable: from,
  toESObservable: stream => stream,
}

export default config
