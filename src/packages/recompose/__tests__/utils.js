import React from 'react'
import wrapDisplayName from '../wrapDisplayName'
import { createRenderer } from 'react-addons-test-utils'

export class BaseComponent extends React.Component {
  renderCount = 0;

  render() {
    return <div {...this.props}/>
  }
}

export const shallowRender = (node, renderer = createRenderer()) => {
  renderer.render(node)
  return renderer.getRenderOutput()
}

export const countRenders = BaseComponent2 => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent2, 'countRenders');
    renderCount = 0;

    render() {
      this.renderCount += 1
      return (
        <BaseComponent2
          renderCount={this.renderCount}
          {...this.props}
        />
      )
    }
  }
)

export class NullComponent extends React.Component {
  render() {
    return null
  }
}

export const addForceUpdate = BaseComponent2 => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent2);
    forceUpdate = this.forceUpdate;

    render() {
      const props = {
        ...this.props,
        forceUpdate: this.forceUpdate
      }

      return <BaseComponent2 {...props} />
    }
  }
)
