import React from 'react'
import { expect } from 'chai'
import { withAttachedProps, compose, withState } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('withAttachedProps()', () => {
  it('passes child prop references that can access current owner props but never change', () => {
    const spy = createSpy()
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withAttachedProps(getProps => ({
        increment: () => getProps().updateCounter(n => n + 1)
      })),
      spy
    )('div')

    expect(Counter.displayName).to.equal(
      'withState(withAttachedProps(spy(div)))'
    )

    renderIntoDocument(<Counter />)

    expect(spy.getProps().counter).to.equal(0)
    spy.getProps().increment()
    expect(spy.getProps().counter).to.equal(1)
    expect(spy.getProps(0, 0).increment).to.equal(spy.getProps(0, 1).increment)
  })
})
