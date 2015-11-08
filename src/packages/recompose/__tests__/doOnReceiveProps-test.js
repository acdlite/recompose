import React from 'react'
import { expect } from 'chai'
import { doOnReceiveProps, compose, withState, mapProps } from 'recompose'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('doOnReceiveProps()', () => {
  it('fires a callback when receiving new props', () => {
    const spy = sinon.spy()
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      mapProps(({ updateCounter, ...rest }) => ({
        increment: () => updateCounter(n => n + 1),
        ...rest
      })),
      doOnReceiveProps(spy)
    )('div')

    expect(Counter.displayName).to.equal(
      'withState(mapProps(doOnReceiveProps(div)))'
    )

    renderIntoDocument(<Counter pass="through" />)

    const { increment, pass } = spy.lastCall.args[0]
    expect(pass).to.equal('through')
    expect(spy.lastCall.args[0].counter).to.equal(0)
    increment()
    expect(spy.lastCall.args[0].counter).to.equal(1)
    increment()
    expect(spy.lastCall.args[0].counter).to.equal(2)
  })
})
