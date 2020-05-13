import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { withReducer, compose, flattenProp } from '../'

const SET_COUNTER = 'SET_COUNTER'

test('adds a stateful value and a function for updating it', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialState = { counter: 0 }

  const reducer = (state, action) =>
    action.type === SET_COUNTER ? { counter: action.payload } : state

  const Counter = compose(
    withReducer('state', 'dispatch', reducer, initialState),
    flattenProp('state')
  )(component)

  expect(Counter.displayName).toBe('withReducer(flattenProp(component))')

  mount(<Counter />)
  const { dispatch } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)

  dispatch({ type: SET_COUNTER, payload: 18 })
  expect(component.lastCall.args[0].counter).toBe(18)
})

test('calls initialState when it is a function', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialState = ({ initialCount }) => ({ counter: initialCount })

  const reducer = (state, action) =>
    action.type === SET_COUNTER ? { counter: action.payload } : state

  const Counter = compose(
    withReducer('state', 'dispatch', reducer, initialState),
    flattenProp('state')
  )(component)

  mount(<Counter initialCount={10} />)

  expect(component.lastCall.args[0].counter).toBe(10)
})

test('receives state from reducer when initialState is not provided', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialState = { counter: 0 }

  const reducer = (state = initialState, action) =>
    action.type === SET_COUNTER ? { counter: action.payload } : state

  const Counter = compose(
    withReducer('state', 'dispatch', reducer),
    flattenProp('state')
  )(component)

  mount(<Counter />)

  expect(component.lastCall.args[0].counter).toBe(0)
})

test('calls the given callback with new state after a dispatch call', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialState = { counter: 0 }

  const reducer = (state, action) =>
    action.type === SET_COUNTER ? { counter: action.payload } : state

  const Counter = compose(
    withReducer('state', 'dispatch', reducer, initialState),
    flattenProp('state')
  )(component)

  mount(<Counter />)
  const dispatch = sinon.spy(component.firstCall.args[0].dispatch)
  const callback = sinon.spy()

  dispatch({ type: SET_COUNTER, payload: 11 }, callback)
  expect(dispatch.calledBefore(callback)).toBe(true)
  expect(dispatch.calledOnce).toBe(true)
  expect(callback.calledAfter(dispatch)).toBe(true)
  expect(callback.calledOnce).toBe(true)
  expect(callback.getCall(0).args.length).toBe(1)
  expect(callback.getCall(0).args[0]).toEqual({ counter: 11 })
})
