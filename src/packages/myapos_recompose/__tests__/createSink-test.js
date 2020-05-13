import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { createSink, compose, withState, mapProps } from '../'

test('createSink creates a React component that fires a callback when receiving new props', () => {
  const spy = sinon.spy()
  const Sink = createSink(spy)
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    mapProps(({ updateCounter, ...rest }) => ({
      increment: () => updateCounter(n => n + 1),
      ...rest,
    }))
  )(Sink)

  mount(
    <div>
      <Counter />
    </div>
  )

  const { increment } = spy.lastCall.args[0]
  const getCounter = () => spy.lastCall.args[0].counter
  expect(getCounter()).toBe(0)
  increment()
  expect(getCounter()).toBe(1)
  increment()
  expect(getCounter()).toBe(2)
})
