import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { onlyUpdateForKeysFunc, compose, withState } from '../'

test('onlyUpdateForKeysFunc implements shouldComponentUpdate()', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForKeysFunc(({ counter }) => [counter])
  )(component)

  expect(Counter.displayName).toBe(
    'withState(withState(onlyUpdateForKeysFunc(component)))'
  )

  mount(<Counter />)
  const { updateCounter, updateFoobar } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].foobar).toBe('foobar')

  // Does not update
  updateFoobar('barbaz')
  expect(component.calledOnce).toBe(true)

  updateCounter(42)
  expect(component.calledTwice).toBe(true)
  expect(component.lastCall.args[0].counter).toBe(42)
  expect(component.lastCall.args[0].foobar).toBe('barbaz')
})
