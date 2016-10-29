import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const renderComponent = Component => _ => {
  const factory = createEagerFactory(Component)
  const RenderComponent = props => factory(props)
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
