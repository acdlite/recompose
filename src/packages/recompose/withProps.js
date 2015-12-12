import isFunction from 'lodash/lang/isFunction'
import createHelper from './createHelper'
import createElement from './createElement'

const withProps = (input, BaseComponent) => {
  let getProps
  const props = isFunction(input)
    ? input(getProps)
    : input

  return ownerProps => {
    getProps = () => ownerProps
    return createElement(BaseComponent, {
      ...ownerProps,
      ...props
    })
  }
}

export default createHelper(withProps, 'withProps')
