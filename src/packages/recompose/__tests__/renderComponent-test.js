import React, { Component } from 'react'
import expect from 'expect'
import { renderComponent } from 'recompose'
import { createRenderer } from 'react-addons-test-utils'

describe('renderComponent()', () => {
  it('always renders the given component', () => {
    class Foo extends Component {
      render() {
        return (
          <Bar>
            <Baz {...this.props} />
          </Bar>
        )
      }
    }
    class Bar extends Component {
      render() {
        return <div {...this.props} />
      }
    }
    const Baz = renderComponent(Bar, 'span')
    const renderer = createRenderer()
    renderer.render(<Foo pass="through" />)
    expect(renderer.getRenderOutput()).toEqualJSX(
      <Bar>
        <Bar pass="through" />
      </Bar>
    )
  })
})
