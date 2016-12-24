import test from 'ava'
import React from 'react'
import { withState } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('withState adds a stateful value and a function for updating it', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  t.is(Counter.displayName, 'withState(component)')

  mount(<Counter pass="through" />)
  const { updateCounter } = component.firstCall.args[0]

  t.is(component.lastCall.args[0].counter, 0)
  t.is(component.lastCall.args[0].pass, 'through')

  updateCounter(n => n + 9)
  updateCounter(n => n * 2)

  t.is(component.lastCall.args[0].counter, 18)
  t.is(component.lastCall.args[0].pass, 'through')
})

test('withState also accepts a non-function, which is passed directly to setState()', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  mount(<Counter />)
  const { updateCounter } = component.firstCall.args[0]

  updateCounter(18)
  t.is(component.lastCall.args[0].counter, 18)
})

test('withState accepts setState() callback', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  mount(<Counter />)
  const { updateCounter } = component.firstCall.args[0]

  const renderSpy = sinon.spy(() => {
    t.is(component.lastCall.args[0].counter, 18)
  })

  t.is(component.lastCall.args[0].counter, 0)
  updateCounter(18, renderSpy)
})

test('withState also accepts initialState as function of props', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState(
    'counter',
    'updateCounter',
    props => props.initialCounter
  )(component)

  mount(<Counter initialCounter={1} />)
  const { updateCounter } = component.firstCall.args[0]

  t.is(component.lastCall.args[0].counter, 1)
  updateCounter(n => n * 3)
  t.is(component.lastCall.args[0].counter, 3)
})
