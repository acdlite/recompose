import { createElement } from 'react'
import omit from './utils/omit'

const componentFromProp = propName => {
  const Component = props =>
    createElement(props[propName], omit(props, [propName]))
  Component.displayName = `componentFromProp(${propName})`
  return Component
}

export default componentFromProp
