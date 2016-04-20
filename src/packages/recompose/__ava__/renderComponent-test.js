import test from 'ava'
import React from 'react'
import { renderComponent, withState, compose, branch } from '../'
import { mount } from 'enzyme'

test('renderComponent always renders the given component', t => {
  const Foobar = compose(
    withState('flip', 'updateFlip', false),
    branch(
      props => props.flip,
      renderComponent('div'),
      renderComponent('span')
    )
  )(null)

  const wrapper = mount(<Foobar />)
  const { updateFlip } = wrapper.find('span').props()

  t.is(wrapper.find('span').length, 1)
  t.is(wrapper.find('div').length, 0)

  updateFlip(true)
  t.is(wrapper.find('span').length, 0)
  t.is(wrapper.find('div').length, 1)
})
