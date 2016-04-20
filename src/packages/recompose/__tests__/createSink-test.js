import test from 'ava'
import React from 'react'
import { createSink, compose, withState, mapProps } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('createSink creates a React component that fires a callback when receiving new props', t => {
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
  t.is(getCounter(), 0)
  increment()
  t.is(getCounter(), 1)
  increment()
  t.is(getCounter(), 2)
})
