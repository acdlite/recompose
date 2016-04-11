import React from 'react'
import { expect } from 'chai'
import { renderComponent, withState, compose, branch } from 'recompose'
import { mount } from 'enzyme'

describe('renderComponent()', () => {
  it('always renders the given component', () => {
    const Foobar = compose(
      withState('flip', 'updateFlip', false),
      branch(
        props => props.flip,
        renderComponent('div'),
        renderComponent('span')
      )
    )(null)

    const wrapper = mount(<Foobar />)
    const { updateFlip } = wrapper.find('span').props()

    expect(wrapper.find('span').length).to.equal(1)
    expect(wrapper.find('div').length).to.equal(0)

    updateFlip(true)
    expect(wrapper.find('span').length).to.equal(0)
    expect(wrapper.find('div').length).to.equal(1)
  })
})
