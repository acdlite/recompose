import { Component } from 'react'
import createEagerFactory from './createEagerFactory'
import setDisplayName from './setDisplayName'
import getDisplayName from './getDisplayName'

const hoverable = (
  propName = 'hovered',
  wrapperElement = 'div'
) => BaseComponent => {
  const wrapperFactory = createEagerFactory(wrapperElement)
  const baseFactory = createEagerFactory(BaseComponent)
  const hoc = class Hoverable extends Component {
    constructor(props) {
      super(props)
      this.state = { hovered: false }
    }
    handleMouseEnter = () => {
      this.setState({ hovered: true })
    }
    handleMouseLeave = () => {
      this.setState({ hovered: false })
    }
    render() {
      const props = { [propName]: this.state.hovered, ...this.props }
      return wrapperFactory({
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        children: baseFactory(props),
      })
    }
  }
  return setDisplayName(
    `hoverable(${getDisplayName(wrapperElement)}(${getDisplayName(
      BaseComponent
    )}))`
  )(hoc)
}

export default hoverable
