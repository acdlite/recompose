import createHelper from './createHelper'
import { internalCreateElement } from './createElement'

const renderComponent = Component => _ => {
  const createElement = internalCreateElement(Component)
  const RenderComponent = props => createElement(props)
  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable global-require */
    const wrapDisplayName = require('./wrapDisplayName').default
    /* eslint-enable global-require */
    RenderComponent.displayName =
      wrapDisplayName(Component, 'renderComponent')
  }
  return RenderComponent
}

export default createHelper(renderComponent, 'renderComponent', false)
