import Kefir from 'kefir'
import componentFromStreamWithConfig from './componentFromStreamWithConfig'
import mapPropsStreamWithConfig from './mapPropsStreamWithConfig'
import createEventHandlerWithConfig from './createEventHandlerWithConfig'

export const config = {
  fromESObservable: Kefir.fromESObservable,
  toESObservable: stream => stream.toESObservable(),
}

export const componentFromStream = propsToVdom =>
  componentFromStreamWithConfig(config)(propsToVdom)

export const mapPropsStream = transform =>
  mapPropsStreamWithConfig(config)(transform)

export const createEventHandler = () => createEventHandlerWithConfig(config)
