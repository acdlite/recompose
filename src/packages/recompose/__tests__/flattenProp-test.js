import test from 'ava'
import React from 'react'
import { flattenProp } from '../'
import { shallow } from 'enzyme'

test('flattenProps flattens an object prop and spreads it into the top-level props object', t => {
  const Counter = flattenProp('data-state')('div')
  t.is(Counter.displayName, 'flattenProp(div)')

  const wrapper = shallow(
    <Counter data-pass="through" data-state={{ 'data-counter': 1 }} />
  )

  t.true(wrapper.equals(
    <div
      data-pass="through"
      data-state={{ 'data-counter': 1 }}
      data-counter={1}
    />
  ))

  wrapper.setProps({
    'data-pass': 'through',
    'data-state': { 'data-state': 1 }
  })
  t.true(wrapper.equals(
    <div data-pass="through" data-state={1} />
  ))
})
