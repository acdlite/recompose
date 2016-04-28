import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const renderComponent = Component => _ => {
  const createElement = internalCreateElement(Component)
  const RenderComponent = props => createElement(props)
  if (process.env.NODE_ENV !== 'production') {
    const wrapDisplayName = require('./wrapDisplayName').default
    RenderComponent.displayName =
      wrapDisplayName(Component, 'renderComponent')
  }
  return RenderComponent
}

export default createHelper(renderComponent, 'renderComponent', false)
