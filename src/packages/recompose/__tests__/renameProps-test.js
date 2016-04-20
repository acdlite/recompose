import test from 'ava'
import React from 'react'
import { withProps, renameProps, compose } from '../'
import { shallow } from 'enzyme'

test('renameProps renames props', t => {
  const StringConcat = compose(
    withProps({ so: 123, la: 456 }),
    renameProps({ so: 'do', la: 'fa' })
  )('div')

  t.is(StringConcat.displayName, 'withProps(renameProps(div))')

  const div = shallow(<StringConcat />).find('div')

  t.is(div.prop('do'), 123)
  t.is(div.prop('fa'), 456)
})
