import test from 'ava'
import React from 'react'
import { withReducer, compose, flattenProp } from '../'
import { mount } from 'enzyme'

test('adds a stateful value and a function for updating it', t => {
  const SET_COUNTER = 'SET_COUNTER'

  const reducer = (state, action) =>
    action.type === SET_COUNTER
      ? { counter: action.payload }
      : state

  const initialState = { counter: 0 }

  const Counter = compose(
    withReducer(
      'state',
      'dispatch',
      reducer,
      initialState
    ),
    flattenProp('state')
  )('div')

  t.is(Counter.displayName, 'withReducer(flattenProp(div))')

  const div = mount(<Counter />).find('div')
  const { dispatch } = div.props()

  t.is(div.prop('counter'), 0)

  dispatch({ type: SET_COUNTER, payload: 18 })
  t.is(div.prop('counter'), 18)
})
