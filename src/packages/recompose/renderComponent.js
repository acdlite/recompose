import createHelper from './createHelper'
import createElement from './createElement'

const renderComponent = (Component, _) =>
  props => createElement(Component, props)

export default createHelper(renderComponent, 'renderComponent')
