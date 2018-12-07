import React from 'react'
import { mount } from 'enzyme'
import { withProps, renameProp, composeWithDisplayName } from '../'

test('composeWithDisplayName should wrap the name of the base component and compose other HOCs', () => {
  const StringConcat = composeWithDisplayName(
    'StringConcat',
    withProps({ 'data-so': 123, 'data-la': 456 }),
    renameProp('data-so', 'data-do')
  )('div')

  expect(StringConcat.displayName).toBe('StringConcat(div)')

  const div = mount(<StringConcat />).find('div')
  expect(div.props()).toEqual({ 'data-do': 123, 'data-la': 456 })
})
