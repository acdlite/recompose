import React from 'react'
import { shallow } from 'enzyme'
import { flattenProp } from '../'

test('flattenProps flattens an object prop and spreads it into the top-level props object', () => {
  const Counter = flattenProp('data-state')('div')
  expect(Counter.displayName).toBe('flattenProp(div)')

  const wrapper = shallow(
    <Counter data-pass="through" data-state={{ 'data-counter': 1 }} />
  )

  expect(
    wrapper.equals(
      <div
        data-pass="through"
        data-state={{ 'data-counter': 1 }}
        data-counter={1}
      />
    )
  ).toBe(true)

  wrapper.setProps({
    'data-pass': 'through',
    'data-state': { 'data-state': 1 },
  })
  expect(wrapper.equals(<div data-pass="through" data-state={1} />)).toBe(true)
})
