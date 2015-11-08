import createHelper from './createHelper'
import createElement from './createElement'

const withProps = (props, BaseComponent) =>
  ownerProps => (
    createElement(BaseComponent, {
      ...ownerProps,
      ...props
    })
  )

export default createHelper(withProps, 'withProps')
