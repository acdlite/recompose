import test from 'ava'
import React from 'react'
import { branch, compose, withState, withProps } from '../'
import { mount } from 'enzyme'

test('branch tests props and applies one of two HoCs, for true and false', t => {
  const SayMyName = compose(
    withState('isBad', 'updateIsBad', false),
    branch(
      props => props.isBad,
      withProps({ name: 'Heisenberg' }),
      withProps({ name: 'Walter' })
    )
  )(({ isBad, name, updateIsBad }) =>
    <div>
      <div className="isBad">{isBad ? 'true' : 'false'}</div>
      <div className="name">{name}</div>
      <button onClick={() => updateIsBad(b => !b)}>Toggle</button>
    </div>
  )

  t.is(SayMyName.displayName, 'withState(branch(Component))')

  const wrapper = mount(<SayMyName />)
  const getIsBad = () => wrapper.find('.isBad').text()
  const getName = () => wrapper.find('.name').text()
  const toggle = wrapper.find('button')

  t.is(getIsBad(), 'false')
  t.is(getName(), 'Walter')

  toggle.simulate('click')

  t.is(getIsBad(), 'true')
  t.is(getName(), 'Heisenberg')
})
