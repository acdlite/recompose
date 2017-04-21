import { from, Stream } from 'most'

const config = {
  fromESObservable: from || Stream.from,
}

export default config
