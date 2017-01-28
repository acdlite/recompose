import React, { Component } from 'react'
import getDisplayName from './getDisplayName'
import isClassComponent from './isClassComponent'

const toClass = baseComponent => {
  if (isClassComponent(baseComponent)) {
    return baseComponent
  }

  class ToClass extends Component {
    render() {
      if (typeof baseComponent === 'string') {
        return React.createElement(baseComponent, this.props)
      }
      return baseComponent(this.props, this.context)
    }
  }

  ToClass.displayName = getDisplayName(baseComponent)
  ToClass.propTypes = baseComponent.propTypes
  ToClass.contextTypes = baseComponent.contextTypes
  ToClass.defaultProps = baseComponent.defaultProps

  return ToClass
}

export default toClass
