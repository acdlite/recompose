import omit from './utils/omit'
import createElement from './createElement'

const componentFromProp = propName => {
  const Component = props =>
    createElement(props[propName], omit(props, [propName]))
  Component.displayName = `componentFromProp(${propName})`
  return Component
}

export default componentFromProp
