import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { pure, compose, withState } from '../'
import { countRenders } from './utils'

test('pure implements shouldComponentUpdate() using shallowEqual()', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialTodos = ['eat', 'drink', 'sleep']
  const Todos = compose(
    withState('todos', 'updateTodos', initialTodos),
    pure,
    countRenders
  )(component)

  expect(Todos.displayName).toBe('withState(pure(countRenders(component)))')

  mount(<Todos />)
  const { updateTodos } = component.firstCall.args[0]

  expect(component.lastCall.args[0].todos).toBe(initialTodos)
  expect(component.lastCall.args[0].renderCount).toBe(1)

  // Does not re-render
  updateTodos(initialTodos)
  expect(component.calledOnce).toBe(true)

  updateTodos(todos => todos.slice(0, -1))
  expect(component.calledTwice).toBe(true)
  expect(component.lastCall.args[0].todos).toEqual(['eat', 'drink'])
  expect(component.lastCall.args[0].renderCount).toBe(2)
})
