import React from 'react'
import { expect } from 'chai'
import { createSink, compose, withState, mapProps } from 'recompose'
import { mount } from 'enzyme'

describe('createSink()', () => {
  it('creates a React component that fires a callback when receiving new props', () => {
    const spy = sinon.spy()
    const Sink = createSink(spy)
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      mapProps(({ updateCounter, ...rest }) => ({
        increment: () => updateCounter(n => n + 1),
        ...rest
      }))
    )(Sink)

    mount(<div><Counter /></div>)

    const { increment } = spy.lastCall.args[0]
    const getCounter = () => spy.lastCall.args[0].counter
    expect(getCounter()).to.equal(0)
    increment()
    expect(getCounter()).to.equal(1)
    increment()
    expect(getCounter()).to.equal(2)
  })
})
