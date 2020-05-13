import React from 'react'
import { shallow } from 'enzyme'
import { nest, setDisplayName, toClass } from '../'

test('nest nests components from outer to inner', () => {
  const A = setDisplayName('A')(toClass('div'))
  const B = setDisplayName('B')(toClass('div'))
  const C = setDisplayName('C')(toClass('div'))

  const Nest = nest(A, B, C)

  expect(Nest.displayName).toBe('nest(A, B, C)')

  const wrapper = shallow(<Nest pass="through">Child</Nest>)

  expect(
    wrapper.equals(
      <A pass="through">
        <B pass="through">
          <C pass="through">Child</C>
        </B>
      </A>
    )
  ).toBe(true)
})
