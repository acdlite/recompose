import React from 'react'
import { expect } from 'chai'
import { shouldUpdate, compose, withState } from 'recompose'
import { countRenders } from './utils'
import { mount } from 'enzyme'

describe('shouldUpdate()', () => {
  it('implements shouldComponentUpdate()', () => {
    const initialTodos = ['eat', 'drink', 'sleep']
    const Todos = compose(
      withState('todos', 'updateTodos', initialTodos),
      shouldUpdate((props, nextProps) => props.todos !== nextProps.todos),
      countRenders
    )('div')

    expect(Todos.displayName).to.equal(
      'withState(shouldUpdate(countRenders(div)))'
    )

    const div = mount(<Todos />).find('div')
    const { updateTodos } = div.props()

    expect(div.prop('todos')).to.equal(initialTodos)
    expect(div.prop('renderCount')).to.equal(1)

    // Does not re-render
    updateTodos(initialTodos)
    expect(div.prop('todos')).to.equal(initialTodos)
    expect(div.prop('renderCount')).to.equal(1)

    updateTodos(todos => todos.slice(0, -1))
    expect(div.prop('todos')).to.eql(['eat', 'drink'])
    expect(div.prop('renderCount')).to.equal(2)

  })
})
