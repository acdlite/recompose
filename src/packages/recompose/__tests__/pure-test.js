import test from 'ava'
import React from 'react'
import { pure, compose, withState } from '../'
import { countRenders } from './utils'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('pure implements shouldComponentUpdate() using shallowEqual()', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialTodos = ['eat', 'drink', 'sleep']
  const Todos = compose(
    withState('todos', 'updateTodos', initialTodos),
    pure,
    countRenders
  )(component)

  t.is(Todos.displayName, 'withState(pure(countRenders(component)))')

  mount(<Todos />)
  const { updateTodos } = component.firstCall.args[0]

  t.is(component.lastCall.args[0].todos, initialTodos)
  t.is(component.lastCall.args[0].renderCount, 1)

  // Does not re-render
  updateTodos(initialTodos)
  t.true(component.calledOnce)

  updateTodos(todos => todos.slice(0, -1))
  t.true(component.calledTwice)
  t.deepEqual(component.lastCall.args[0].todos, ['eat', 'drink'])
  t.is(component.lastCall.args[0].renderCount, 2)
})
