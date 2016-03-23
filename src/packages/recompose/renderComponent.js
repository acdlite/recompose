import createHelper from './createHelper'
import createElement from './createElement'

const renderComponent = Component => _ => {
  const RenderComponent = props => createElement(Component, props)
  if (process.env.NODE_ENV !== 'production') {
    const wrapDisplayName = require('./wrapDisplayName').default
    RenderComponent.displayName =
      wrapDisplayName(Component, 'renderComponent')
  }
  return RenderComponent
}

export default createHelper(renderComponent, 'renderComponent', false)
