import React from 'react'
import { expect } from 'chai'
import { nest, setDisplayName, toClass } from 'recompose'
import { shallow } from 'enzyme'

describe('nest()', () => {
  it('nests components from outer to inner', () => {
    const A = setDisplayName('A')(toClass('div'))
    const B = setDisplayName('B')(toClass('div'))
    const C = setDisplayName('C')(toClass('div'))

    const Nest = nest(A, B, C)

    expect(Nest.displayName).to.equal('nest(A, B, C)')

    const wrapper = shallow(
      <Nest pass="through">
        Child
      </Nest>
    )

    expect(wrapper.equals(
      <A pass="through">
        <B pass="through">
          <C pass="through">
            Child
          </C>
        </B>
      </A>
    )).to.be.true
  })
})
