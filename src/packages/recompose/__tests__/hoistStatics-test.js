import React, { Component } from 'react'
import { expect } from 'chai'
import { hoistStatics, compose, mapProps } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('hoistStatics()', () => {
  it('copies non-React static properties from base component to new component', () => {
    class BaseComponent extends Component {
      render() {
        return <div {...this.props} />
      }
    }

    BaseComponent.update = () => {}

    const spy = createSpy()
    const NewComponent = compose(
      hoistStatics(mapProps(props => ({ n: props.n * 5 }))),
      hoistStatics(spy)
    )(BaseComponent)

    renderIntoDocument(<NewComponent n={3} />)

    expect(spy.getProps().n).to.equal(15)
    expect(NewComponent.update).to.equal(BaseComponent.update)
  })
})
