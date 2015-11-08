import createHelper from './createHelper'
import createElement from './createElement'

const doOnReceiveProps = (callback, BaseComponent) =>
  props => {
    callback(props)
    return createElement(BaseComponent, props)
  }

export default createHelper(doOnReceiveProps, 'doOnReceiveProps')
