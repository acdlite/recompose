import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import { withState } from '../'

test('withState adds a stateful value and a function for updating it', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  expect(Counter.displayName).toBe('withState(component)')

  mount(<Counter pass="through" />)
  const { updateCounter } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].pass).toBe('through')

  updateCounter(n => n + 9)
  updateCounter(n => n * 2)

  expect(component.lastCall.args[0].counter).toBe(18)
  expect(component.lastCall.args[0].pass).toBe('through')
})

test('withState also accepts a non-function, which is passed directly to setState()', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  mount(<Counter />)
  const { updateCounter } = component.firstCall.args[0]

  updateCounter(18)
  expect(component.lastCall.args[0].counter).toBe(18)
})

test('withState accepts setState() callback', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  mount(<Counter />)
  const { updateCounter } = component.firstCall.args[0]

  const renderSpy = sinon.spy(() => {
    expect(component.lastCall.args[0].counter).toBe(18)
  })

  expect(component.lastCall.args[0].counter).toBe(0)
  updateCounter(18, renderSpy)
})

test('withState also accepts initialState as function of props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState(
    'counter',
    'updateCounter',
    props => props.initialCounter
  )(component)

  mount(<Counter initialCounter={1} />)
  const { updateCounter } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(1)
  updateCounter(n => n * 3)
  expect(component.lastCall.args[0].counter).toBe(3)
})
