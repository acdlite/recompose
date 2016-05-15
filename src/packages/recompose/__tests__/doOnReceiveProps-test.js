import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import { mapProps, withState, compose } from '../'
import doOnReceiveProps from '../doOnReceiveProps'
import sinon from 'sinon'
import pick from '../utils/pick'

test('doOnReceiveProps fires a callback before mounting and before receiving new props', t => {
  const callbackSpy = sinon.spy()

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    mapProps(({ updateCounter, ...rest }) => ({
      increment: () => updateCounter(n => n + 1),
      ...rest
    })),
    doOnReceiveProps(callbackSpy)
  )('div')

  mount(<Counter pass="through" />)

  t.is(callbackSpy.lastCall.args[0], null)
  t.is(callbackSpy.lastCall.args[1].counter, 0)

  const { increment, pass } = callbackSpy.lastCall.args[1]
  t.is(pass, 'through')

  increment()
  t.is(callbackSpy.lastCall.args[0].counter, 0)
  t.is(callbackSpy.lastCall.args[1].counter, 1)

  increment()
  t.is(callbackSpy.lastCall.args[0].counter, 1)
  t.is(callbackSpy.lastCall.args[1].counter, 2)

  t.true(callbackSpy.calledThrice)

  t.deepEqual(
    pick(callbackSpy.lastCall.args[1], ['pass', 'counter']),
    { pass: 'through', counter: 2 }
  )
})
