import React, { Component } from 'react'
import getDisplayName from './getDisplayName'
import isClassComponent from './isClassComponent'

const toClass = baseComponent =>
  isClassComponent(baseComponent)
    ? baseComponent
    : class ToClass extends Component {
        static displayName = getDisplayName(baseComponent)
        static propTypes = baseComponent.propTypes
        static contextTypes = baseComponent.contextTypes
        static defaultProps = baseComponent.defaultProps
        render() {
          return React.createElement(baseComponent, this.props)
        }
      }
export default toClass
