import test from 'ava'
import React from 'react'
import { flattenProp } from '../'
import { shallow } from 'enzyme'

test('flattenProps flattens an object prop and spreads it into the top-level props object', t => {
  const Counter = flattenProp('state')('div')
  t.is(Counter.displayName, 'flattenProp(div)')

  let wrapper = shallow(
    <Counter pass="through" state={{ counter: 1 }} />
  )

  t.true(wrapper.equals(
    <div pass="through" state={{ counter: 1 }} counter={1} />
  ))

  wrapper = shallow(
    <Counter pass="through" state={{ state: 1 }} />
  )
  t.true(wrapper.equals(
    <div pass="through" state={1} />
  ))
})
