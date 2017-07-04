import { from } from 'rxjs/Observable/from'

const config = {
  fromESObservable: from,
  toESObservable: stream => stream,
}

export default config
