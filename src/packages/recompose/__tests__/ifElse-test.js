import sinon from 'sinon'
import React from 'react'
import { mount } from 'enzyme'
import { ifElse, compose, withState, withProps } from '../'

test('branch tests props and invokes one of two functions, for true and false', () => {
  const heisenberg = sinon.spy();
  const walter = sinon.spy();
  const SayMyName = compose(
    withState('isBad', 'updateIsBad', false),
    ifElse(
      props => props.isBad,
      props => heisenberg(),
      props => walter()
    )
  )(({ isBad, name, updateIsBad }) => (
    <div>
      <button onClick={() => updateIsBad(b => !b)}>Toggle</button>
    </div>
  ))

  expect(SayMyName.displayName).toBe('withState(branch(Component))')

  const wrapper = mount(<SayMyName />)
  const toggle = wrapper.find('button')

  expect(walter.calledOnce).toBe(true)

  toggle.simulate('click')

  expect(heisenberg.calledOnce).toBe(true)
})
