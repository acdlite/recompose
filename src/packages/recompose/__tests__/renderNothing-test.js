import test from 'ava'
import React from 'react'
import { renderNothing } from '../'
import { shallow } from 'enzyme'

test('renderNothing returns a component that renders null', t => {
  const Nothing = renderNothing('div')
  const wrapper = shallow(<Nothing />)
  t.is(wrapper.type(), null)
  t.is(Nothing.displayName, 'Nothing')
})
