import React from 'react'
import { expect } from 'chai'
import { componentFromProp } from 'recompose'
import { mount } from 'enzyme'

describe('componentFromProp()', () => {
  it('returns a component takes a component as a prop and renders it with the rest of the props', () => {
    const Container = componentFromProp('component')
    expect(Container.displayName).to.equal('componentFromProp(component)')

    const Component = ({ pass }) =>
      <div>Pass: {pass}</div>

    const wrapper = mount(
      <Container component={Component} pass="through" />
    )
    const div = wrapper.find('div')
    expect(div.text()).to.equal('Pass: through')
  })
})
