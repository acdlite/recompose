import React from 'react'
import { expect } from 'chai'
import { hoistStatics, mapProps } from 'recompose'
import { shallow } from 'enzyme'

describe('hoistStatics()', () => {
  it('copies non-React static properties from base component to new component', () => {
    const BaseComponent = props => <div {...props} />
    BaseComponent.foo = () => {}

    const EnhancedComponent = hoistStatics(
      mapProps(props => ({ n: props.n * 5 }))
    )(BaseComponent)

    expect(EnhancedComponent.foo).to.equal(BaseComponent.foo)

    const wrapper = shallow(<EnhancedComponent n={3} />)
    expect(wrapper.prop('n')).to.equal(15)
  })
})
