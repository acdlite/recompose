import test from 'ava'
import React from 'react'
import { nest, setDisplayName, toClass } from '../'
import { shallow } from 'enzyme'

test('nest nests components from outer to inner', t => {
  const A = setDisplayName('A')(toClass('div'))
  const B = setDisplayName('B')(toClass('div'))
  const C = setDisplayName('C')(toClass('div'))

  const Nest = nest(A, B, C)

  t.is(Nest.displayName, 'nest(A, B, C)')

  const wrapper = shallow(
    <Nest pass="through">
      Child
    </Nest>
  )

  t.true(wrapper.equals(
    <A pass="through">
      <B pass="through">
        <C pass="through">
          Child
        </C>
      </B>
    </A>
  ))
})
