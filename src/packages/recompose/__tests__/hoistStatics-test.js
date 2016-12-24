import test from 'ava'
import React from 'react'
import { hoistStatics, mapProps } from '../'
import { shallow } from 'enzyme'
import sinon from 'sinon'

test('copies non-React static properties from base component to new component', t => {
  const BaseComponent = sinon.spy(() => null)
  BaseComponent.foo = () => {}

  const EnhancedComponent = hoistStatics(
    mapProps(props => ({ n: props.n * 5 }))
  )(BaseComponent)

  t.is(EnhancedComponent.foo, BaseComponent.foo)

  shallow(<EnhancedComponent n={3} />)
  t.is(BaseComponent.firstCall.args[0].n, 15)
})
