import { Component } from 'react'
import createElement from './createElement'
import createHelper from './createHelper'

const withAttachedProps = createProps => BaseComponent =>
  class extends Component {
    attachedProps = createProps(() => this.props);
    render() {
      return createElement(BaseComponent, {
        ...this.props,
        ...this.attachedProps
      })
    }
  }

export default createHelper(withAttachedProps, 'withAttachedProps')
