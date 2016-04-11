import React from 'react'
import { expect } from 'chai'
import { branch, compose, withState, withProps } from 'recompose'
import { mount } from 'enzyme'

describe('branch()', () => {
  it('tests props and applies one of two HoCs, for true and false', () => {
    const SayMyName = compose(
      withState('isBad', 'updateIsBad', false),
      branch(
        props => props.isBad,
        withProps({ name: 'Heisenberg' }),
        withProps({ name: 'Walter' })
      )
    )(({ isBad, name, updateIsBad }) =>
      <div>
        <div className="isBad">{isBad ? 'true' : 'false'}</div>
        <div className="name">{name}</div>
        <button onClick={() => updateIsBad(b => !b)}>Toggle</button>
      </div>
    )

    expect(SayMyName.displayName).to.equal(
      'withState(branch(Component))'
    )

    const wrapper = mount(<SayMyName />)
    const isBad = wrapper.find('.isBad')
    const name = wrapper.find('.name')
    const toggle = wrapper.find('button')

    expect(isBad.text()).to.equal('false')
    expect(name.text()).to.equal('Walter')

    toggle.simulate('click')

    expect(isBad.text()).to.equal('true')
    expect(name.text()).to.equal('Heisenberg')
  })
})
