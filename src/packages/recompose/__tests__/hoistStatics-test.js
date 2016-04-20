import test from 'ava'
import React from 'react'
import { hoistStatics, mapProps } from '../'
import { shallow } from 'enzyme'

test('copies non-React static properties from base component to new component', t => {
  const BaseComponent = props => <div {...props} />
  BaseComponent.foo = () => {}

  const EnhancedComponent = hoistStatics(
    mapProps(props => ({ n: props.n * 5 }))
  )(BaseComponent)

  t.is(EnhancedComponent.foo, BaseComponent.foo)

  const wrapper = shallow(<EnhancedComponent n={3} />)
  t.is(wrapper.prop('n'), 15)
})
