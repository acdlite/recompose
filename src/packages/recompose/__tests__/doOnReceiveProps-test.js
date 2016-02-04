import React from 'react'
import { expect } from 'chai'
import omit from 'lodash/omit'
import { doOnReceiveProps, compose, withState, mapProps } from 'recompose'
import createSpy from 'recompose/createSpy'
import { renderIntoDocument } from 'react-addons-test-utils'

describe('doOnReceiveProps()', () => {
  it('fires a callback when receiving new props', () => {
    const callbackSpy = sinon.spy()
    const spy = createSpy()

    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      mapProps(({ updateCounter, ...rest }) => ({
        increment: () => updateCounter(n => n + 1),
        ...rest
      })),
      doOnReceiveProps(callbackSpy),
      spy
    )('div')

    expect(Counter.displayName).to.equal(
      'withState(mapProps(doOnReceiveProps(spy(div))))'
    )

    renderIntoDocument(<Counter pass="through" />)

    const { increment, pass } = callbackSpy.lastCall.args[0]
    expect(pass).to.equal('through')
    expect(callbackSpy.lastCall.args[0].counter).to.equal(0)
    increment()
    expect(callbackSpy.lastCall.args[0].counter).to.equal(1)
    increment()
    expect(callbackSpy.lastCall.args[0].counter).to.equal(2)

    expect(omit(spy.getProps(), ['increment'])).to.eql({
      pass: 'through',
      counter: 2,
    })
  })
})
