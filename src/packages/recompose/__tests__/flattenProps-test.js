import React from 'react'
import { shallow } from 'enzyme'
import { flattenProps } from '../'

test('flattenProps flattens object props and spreads them into the top-level props object', () => {
  const Counter = flattenProps(['data-first', 'data-second'])('div')
  expect(Counter.displayName).toBe('flattenProps(div)')

  const wrapper = shallow(
    <Counter
      data-pass="through"
      data-first={{ 'data-foo': 1 }}
      data-second={{ 'data-bar': 2 }}
    />
  )

  expect(
    wrapper.equals(
      <div
        data-pass="through"
        data-first={{ 'data-foo': 1 }}
        data-second={{ 'data-bar': 2 }}
        data-foo={1}
        data-bar={2}
      />
    )
  ).toBe(true)
})
