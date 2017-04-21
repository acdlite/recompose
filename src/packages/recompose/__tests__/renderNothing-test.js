import React from 'react'
import { shallow } from 'enzyme'
import { renderNothing } from '../'

test('renderNothing returns a component that renders null', () => {
  const Nothing = renderNothing('div')
  const wrapper = shallow(<Nothing />)
  expect(wrapper.type()).toBe(null)
  expect(Nothing.displayName).toBe('Nothing')
})
