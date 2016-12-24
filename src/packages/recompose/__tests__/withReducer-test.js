import test from 'ava'
import React from 'react'
import { withReducer, compose, flattenProp } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

const SET_COUNTER = 'SET_COUNTER'

test('adds a stateful value and a function for updating it', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

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
  )(component)

  t.is(Counter.displayName, 'withReducer(flattenProp(component))')

  mount(<Counter />)
  const { dispatch } = component.firstCall.args[0]

  t.is(component.lastCall.args[0].counter, 0)

  dispatch({ type: SET_COUNTER, payload: 18 })
  t.is(component.lastCall.args[0].counter, 18)
})

test('calls initialState when it is a function', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

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
  )(component)

  mount(<Counter initialCount={10} />)

  t.is(component.lastCall.args[0].counter, 10)
})

test('receives state from reducer when initialState is not provided', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

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
  )(component)

  mount(<Counter />)

  t.is(component.lastCall.args[0].counter, 0)
})
