import { from } from 'rxjs'

const config = {
  fromESObservable: from,
  toESObservable: stream => stream,
}

export default config
