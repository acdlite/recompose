import wrapDisplayName from './wrapDisplayName'
import { createFactory } from './utils/factory'

const renderComponent = (Component) => (_) => {
  const factory = createFactory(Component)
  const RenderComponent = (props) => factory(props)
  if (process.env.NODE_ENV !== 'production') {
    RenderComponent.displayName = wrapDisplayName(Component, 'renderComponent')
  }
  return RenderComponent
}

export default renderComponent
