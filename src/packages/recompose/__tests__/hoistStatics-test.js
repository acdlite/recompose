import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { hoistStatics, mapProps } from '../'

test('copies non-React static properties from base component to new component', () => {
  const BaseComponent = sinon.spy(() => null)
  BaseComponent.foo = () => {}

  const EnhancedComponent = hoistStatics(
    mapProps(props => ({ n: props.n * 5 }))
  )(BaseComponent)

  expect(EnhancedComponent.foo).toBe(BaseComponent.foo)

  shallow(<EnhancedComponent n={3} />)
  expect(BaseComponent.firstCall.args[0].n).toBe(15)
})
