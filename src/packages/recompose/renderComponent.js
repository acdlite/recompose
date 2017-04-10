import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'
import wrapDisplayName from './wrapDisplayName'

const renderComponent = Component => _ => {
  const factory = createEagerFactory(Component)
  const RenderComponent = props => factory(props)
  if (process.env.NODE_ENV !== 'production') {
    RenderComponent.displayName =
      wrapDisplayName(Component, 'renderComponent')
  }
  return RenderComponent
}

export default createHelper(renderComponent, 'renderComponent', false)
