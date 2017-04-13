import React from 'react'
import { withProps, renameProp, compose } from '../'
import { shallow } from 'enzyme'

test('renameProp renames a single prop', () => {
  const StringConcat = compose(
    withProps({ 'data-so': 123, 'data-la': 456 }),
    renameProp('data-so', 'data-do')
  )('div')

  expect(StringConcat.displayName).toBe('withProps(renameProp(div))')

  const div = shallow(<StringConcat />).find('div')
  expect(div.props()).toEqual({ 'data-do': 123, 'data-la': 456 })
})
