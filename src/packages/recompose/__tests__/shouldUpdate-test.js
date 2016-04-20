import test from 'ava'
import React from 'react'
import { shouldUpdate, compose, withState } from '../'
import { countRenders } from './utils'
import { mount } from 'enzyme'

test('shouldUpdate implements shouldComponentUpdate', t => {
  const initialTodos = ['eat', 'drink', 'sleep']
  const Todos = compose(
    withState('todos', 'updateTodos', initialTodos),
    shouldUpdate((props, nextProps) => props.todos !== nextProps.todos),
    countRenders
  )('div')

  t.is(Todos.displayName, 'withState(shouldUpdate(countRenders(div)))')

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
