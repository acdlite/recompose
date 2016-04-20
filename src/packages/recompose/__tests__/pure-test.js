import test from 'ava'
import React from 'react'
import { pure, compose, withState } from '../'
import { countRenders } from './utils'
import { mount } from 'enzyme'

test('pure implements shouldComponentUpdate() using shallowEqual()', t => {
  const initialTodos = ['eat', 'drink', 'sleep']
  const Todos = compose(
    withState('todos', 'updateTodos', initialTodos),
    pure,
    countRenders
  )('div')

  t.is(Todos.displayName, 'withState(pure(countRenders(div)))')

  const div = mount(<Todos />).find('div')
  const { updateTodos } = div.props()

  t.is(div.prop('todos'), initialTodos)
  t.is(div.prop('renderCount'), 1)

  // Does not re-render
  updateTodos(initialTodos)
  t.is(div.prop('todos'), initialTodos)
  t.is(div.prop('renderCount'), 1)

  updateTodos(todos => todos.slice(0, -1))
  t.deepEqual(div.prop('todos'), ['eat', 'drink'])
  t.is(div.prop('renderCount'), 2)
})
