import React from 'react'
import { mount } from 'enzyme'
import { componentFromProp } from '../'

test('componentFromProp creates a component that takes a component as a prop and renders it with the rest of the props', () => {
  const Container = componentFromProp('component')
  expect(Container.displayName).toBe('componentFromProp(component)')

  const Component = ({ pass }) =>
    <div>
      Pass: {pass}
    </div>

  const wrapper = mount(<Container component={Component} pass="through" />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('Pass: through')
})
