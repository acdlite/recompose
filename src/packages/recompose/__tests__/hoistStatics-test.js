import React, { createFactory } from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { hoistStatics, mapProps } from '../'

test('copies non-React static properties from base component to new component', () => {
  const BaseComponent = sinon.spy(() => null)
  BaseComponent.foo = () => {}

  const EnhancedComponent = hoistStatics(
    mapProps(props => ({ n: props.n * 5 }))
  )(BaseComponent)

  expect(EnhancedComponent.foo).toBe(BaseComponent.foo)

  mount(<EnhancedComponent n={3} />)
  expect(BaseComponent.firstCall.args[0].n).toBe(15)
})

test('does not copy blacklisted static properties to new component ', () => {
  const BaseComponent = sinon.spy(() => null)
  BaseComponent.foo = () => {}
  BaseComponent.bar = () => {}

  const EnhancedComponent = hoistStatics(
    comp => createFactory(comp),
    { bar: true } // Blacklist
  )(BaseComponent)

  expect(EnhancedComponent.foo).toBe(BaseComponent.foo)
  expect(EnhancedComponent.bar).toBe(undefined)
})
