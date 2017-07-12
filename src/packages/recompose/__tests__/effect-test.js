import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { effect } from '../'

test('effect calls its provided function', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  let external = ''

  const Component = effect(({ foo }) => {
    external = foo
  })(component)

  expect(Component.displayName).toBe('effect(component)')
  mount(<Component foo="bar" />)
  expect(external).toBe('bar')
})
