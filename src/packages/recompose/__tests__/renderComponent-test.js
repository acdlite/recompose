import React from 'react'
import { expect } from 'chai'

import {
  renderComponent,
  compose,
  withState,
  branch,
  withProps
} from 'recompose'

import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('renderComponent()', () => {
  it('always renders the given component', () => {
    const spy = createSpy()

    const Foobar = compose(
      withState('flip', 'updateFlip', false),
      branch(
        props => props.flip,
        renderComponent(
          compose(
            withProps({ foo: 'bar' }),
            spy
          )('div')
        ),
        renderComponent(
          compose(
            withProps({ foo: 'baz' }),
            spy
          )('div')
        ),
      )
    )(null)

    renderIntoDocument(<Foobar />)

    expect(spy.getProps().foo).to.equal('baz')
    spy.getProps().updateFlip(true)
    expect(spy.getProps().foo).to.equal('bar')
  })
})
