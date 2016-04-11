import React from 'react'
import { expect } from 'chai'
import { onlyUpdateForKeys, compose, withState } from 'recompose'
import { mount } from 'enzyme'

describe('onlyUpdateForKeys()', () => {
  it('implements shouldComponentUpdate()', () => {
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      onlyUpdateForKeys(['counter'])
    )('div')

    expect(Counter.displayName).to.equal(
      'withState(withState(onlyUpdateForKeys(div)))'
    )

    const div = mount(<Counter />).find('div')
    const { updateCounter, updateFoobar } = div.props()

    expect(div.prop('counter')).to.equal(0)
    expect(div.prop('foobar')).to.equal('foobar')

    // Does not update
    updateFoobar('barbaz')
    expect(div.prop('counter')).to.equal(0)
    expect(div.prop('foobar')).to.equal('foobar')

    updateCounter(42)
    expect(div.prop('counter')).to.equal(42)
    expect(div.prop('foobar')).to.equal('barbaz')
  })
})
