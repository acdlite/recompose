import test from 'ava'
import React from 'react'
import { withProps, renameProps, compose } from '../'
import { shallow } from 'enzyme'

test('renameProps renames props', t => {
  const StringConcat = compose(
    withProps({ 'data-so': 123, 'data-la': 456 }),
    renameProps({ 'data-so': 'data-do', 'data-la': 'data-fa' })
  )('div')

  t.is(StringConcat.displayName, 'withProps(renameProps(div))')

  const div = shallow(<StringConcat />).find('div')

  t.is(div.prop('data-do'), 123)
  t.is(div.prop('data-fa'), 456)
})
