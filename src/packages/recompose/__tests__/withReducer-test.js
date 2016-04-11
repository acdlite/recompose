import React from 'react'
import { expect } from 'chai'
import { withReducer, compose, flattenProp } from 'recompose'
import { mount } from 'enzyme'

describe('withReducer()', () => {
  it('adds a stateful value and a function for updating it', () => {
    const SET_COUNTER = 'SET_COUNTER'

    const reducer = (state, action) => (
      action.type === SET_COUNTER
        ? { counter: action.payload }
        : state
    )

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

    expect(Counter.displayName).to.equal(
      'withReducer(flattenProp(div))'
    )

    const div = mount(<Counter />).find('div')
    const { dispatch } = div.props()

    expect(div.prop('counter')).to.equal(0)

    dispatch({ type: SET_COUNTER, payload: 18 })
    expect(div.prop('counter')).to.equal(18)
  })
})
