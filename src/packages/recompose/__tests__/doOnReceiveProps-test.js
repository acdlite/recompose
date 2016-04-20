import test from 'ava'
import React from 'react'
import { doOnReceiveProps, compose, withState, mapProps } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('doOnReceiveProps fires a callback when receiving new props', t => {
  const spy = sinon.spy()
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    mapProps(({ updateCounter, ...rest }) => ({
      increment: () => updateCounter(n => n + 1),
      ...rest
    })),
    doOnReceiveProps(spy)
  )('div')

  t.is(Counter.displayName, 'withState(mapProps(doOnReceiveProps(div)))')

  const div = mount(<Counter />).find('div')
  const { increment } = div.props()
  const getCounter = () => spy.lastCall.args[0].counter

  t.is(getCounter(), 0)
  increment()
  t.is(getCounter(), 1)
  increment()
  t.is(getCounter(), 2)
})
