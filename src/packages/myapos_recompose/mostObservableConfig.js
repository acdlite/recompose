import { from, Stream } from 'most'

const config = {
  fromESObservable: from || Stream.from,
  toESObservable: stream => stream,
}

export default config
