import React from 'react'
import { renderNothing } from '../'
import { shallow } from 'enzyme'

test('renderNothing returns a component that renders null', () => {
  const Nothing = renderNothing('div')
  const wrapper = shallow(<Nothing />)
  expect(wrapper.type()).toBe(null)
  expect(Nothing.displayName).toBe('Nothing')
})
