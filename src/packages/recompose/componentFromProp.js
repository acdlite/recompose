import omit from './utils/omit'
import createEagerElement from './createEagerElement'

const componentFromProp = propName => {
  const Component = props =>
    createEagerElement(props[propName], omit(props, [propName]))
  Component.displayName = `componentFromProp(${propName})`
  return Component
}

export default componentFromProp
