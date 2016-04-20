import test from 'ava'
import React from 'react'
import { componentFromProp } from '../'
import { mount } from 'enzyme'

test('componentFromProp creates a component that takes a component as a prop and renders it with the rest of the props', t => {
  const Container = componentFromProp('component')
  t.is(Container.displayName, 'componentFromProp(component)')

  const Component = ({ pass }) =>
    <div>Pass: {pass}</div>

  const wrapper = mount(
    <Container component={Component} pass="through" />
  )
  const div = wrapper.find('div')
  t.is(div.text(), 'Pass: through')
})
