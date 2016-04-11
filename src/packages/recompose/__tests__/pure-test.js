import React from 'react'
import { expect } from 'chai'
import { pure, compose, withState } from 'recompose'
import { countRenders } from './utils'
import { mount } from 'enzyme'

describe('pure()', () => {
  it('implements shouldComponentUpdate() using shallowEqual()', () => {
    const initialTodos = ['eat', 'drink', 'sleep']
    const Todos = compose(
      withState('todos', 'updateTodos', initialTodos),
      pure,
      countRenders
    )('div')

    expect(Todos.displayName).to.equal(
      'withState(pure(countRenders(div)))'
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
