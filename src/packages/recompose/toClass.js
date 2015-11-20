import { Component } from 'react'
import getDisplayName from './getDisplayName'
import isClassComponent from './isClassComponent'

const toClass = baseComponent => {
  if (isClassComponent(baseComponent)) {
    return baseComponent
  }

  const NewComponent = class extends Component {
    render() {
      return baseComponent(this.props, this.context)
    }
  }
  NewComponent.displayName = getDisplayName(baseComponent)
  NewComponent.propTypes = baseComponent.propTypes
  NewComponent.contextTypes = baseComponent.contextTypes
  NewComponent.defaultProps = baseComponent.defaultProps

  return NewComponent
}

export default toClass
