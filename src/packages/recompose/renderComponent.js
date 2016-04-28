import createHelper from './createHelper'
import { curriedCreateElement } from './createElement'

const renderComponent = Component => _ => {
  const createElement = curriedCreateElement(Component)
  const RenderComponent = props => createElement(props)
  if (process.env.NODE_ENV !== 'production') {
    const wrapDisplayName = require('./wrapDisplayName').default
    RenderComponent.displayName =
      wrapDisplayName(Component, 'renderComponent')
  }
  return RenderComponent
}

export default createHelper(renderComponent, 'renderComponent', false)
