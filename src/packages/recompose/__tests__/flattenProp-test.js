import React from 'react'
import { expect } from 'chai'
import { flattenProp } from 'recompose'
import { shallow } from 'enzyme'

describe('flattenProp()', () => {
  it('flattens an object prop and spreads it into the top-level props object', () => {
    const Counter = flattenProp('state')('div')

    expect(Counter.displayName).to.equal('flattenProp(div)')

    const wrapper = shallow(
      <Counter pass="through" state={{ counter: 1 }} />
    )

    expect(wrapper.equals(
      <div pass="through" counter={1} />
    )).to.be.true
  })
})
