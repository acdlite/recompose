import test from 'ava'
import React from 'react'
import { withState } from 'recompose'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('withState adds a stateful value and a function for updating it', t => {
  const Counter = withState('counter', 'updateCounter', 0)('div')
  t.is(Counter.displayName, 'withState(div)')

  const div = mount(<Counter pass="through" />).find('div')
  const { updateCounter } = div.props()

  t.is(div.prop('counter'), 0)
  t.is(div.prop('pass'), 'through')

  updateCounter(n => n + 9)
  updateCounter(n => n * 2)
  t.is(div.prop('counter'), 18)
  t.is(div.prop('pass'), 'through')
})

test('withState also accepts a non-function, which is passed directly to setState()', t => {
  const Counter = withState('counter', 'updateCounter', 0)('div')
  const div = mount(<Counter />).find('div')
  const { updateCounter } = div.props()

  updateCounter(18)
  t.is(div.prop('counter'), 18)
})

test('withState accepts setState() callback', t => {
  const Counter = withState('counter', 'updateCounter', 0)('div')
  const div = mount(<Counter />).find('div')
  const { updateCounter } = div.props()

  const renderSpy = sinon.spy(() => {
    t.is(div.prop('counter'), 18)
  })

  t.is(div.prop('counter'), 0)
  updateCounter(18, renderSpy)
})

test('withState also accepts initialState as function of props', t => {
  const Counter = withState(
    'counter',
    'updateCounter',
    props => props.initialCounter
  )('div')

  const div = mount(<Counter initialCounter={1} />).find('div')
  const { updateCounter } = div.props()

  t.is(div.prop('counter'), 1)
  updateCounter(n => n * 3)
  t.is(div.prop('counter'), 3)
})
