import React from 'react'
import { shallow } from 'enzyme'
import { renderNothing } from '../'

test('renderNothing returns a component that renders null', () => {
  const Nothing = renderNothing('div')
  const wrapper = shallow(<Nothing />)

  const Parent = () => <Nothing />
  const parentWrapper = shallow(<Parent />)

  expect(wrapper.type()).toBe(null)
  expect(parentWrapper.text()).toBe('<Nothing />')
})
