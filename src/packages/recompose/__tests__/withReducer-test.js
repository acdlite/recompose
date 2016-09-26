import test from 'ava'
import React from 'react'
import { withReducer, compose, flattenProp } from '../'
import { mount } from 'enzyme'

const SET_COUNTER = 'SET_COUNTER'

test('adds a stateful value and a function for updating it', t => {
  const initialState = { counter: 0 }

  const reducer = (state, action) =>
    action.type === SET_COUNTER
      ? { counter: action.payload }
      : state

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

test('calls initialState when it is a function', t => {
  const initialState = ({ initialCount }) => ({ counter: initialCount })

  const reducer = (state, action) =>
    action.type === SET_COUNTER
      ? { counter: action.payload }
      : state

  const Counter = compose(
    withReducer(
      'state',
      'dispatch',
      reducer,
      initialState
    ),
    flattenProp('state')
  )('div')

  const div = mount(<Counter initialCount={10} />).find('div')

  t.is(div.prop('counter'), 10)
})

test('receives state from reducer when initialState is not provided', t => {
  const initialState = { counter: 0 }

  const reducer = (state = initialState, action) =>
    action.type === SET_COUNTER
      ? { counter: action.payload }
      : state

  const Counter = compose(
    withReducer(
      'state',
      'dispatch',
      reducer
    ),
    flattenProp('state')
  )('div')

  const div = mount(<Counter />).find('div')

  t.is(div.prop('counter'), 0)
})
