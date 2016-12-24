import test from 'ava'
import React from 'react'
import { onlyUpdateForKeys, compose, withState } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('onlyUpdateForKeys implements shouldComponentUpdate()', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForKeys(['counter'])
  )(component)

  t.is(
    Counter.displayName,
    'withState(withState(onlyUpdateForKeys(component)))'
  )

  mount(<Counter />)
  const { updateCounter, updateFoobar } = component.firstCall.args[0]

  t.is(component.lastCall.args[0].counter, 0)
  t.is(component.lastCall.args[0].foobar, 'foobar')

  // Does not update
  updateFoobar('barbaz')
  t.true(component.calledOnce)

  updateCounter(42)
  t.true(component.calledTwice)
  t.is(component.lastCall.args[0].counter, 42)
  t.is(component.lastCall.args[0].foobar, 'barbaz')
})
