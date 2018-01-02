import React, { Component } from 'react'
import getDisplayName from './getDisplayName'
import isClassComponent from './isClassComponent'

const toClass = (baseComponent, Class = Component) =>
  isClassComponent(baseComponent)
    ? baseComponent
    : class ToClass extends Class {
        static displayName = getDisplayName(baseComponent)
        static propTypes = baseComponent.propTypes
        static contextTypes = baseComponent.contextTypes
        static defaultProps = baseComponent.defaultProps
        render() {
          if (typeof baseComponent === 'string') {
            return React.createElement(baseComponent, this.props)
          }
          return baseComponent(this.props, this.context, this)
        }
      }
export default toClass
