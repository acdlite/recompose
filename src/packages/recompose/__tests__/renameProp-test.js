import test from 'ava'
import React from 'react'
import { withProps, renameProp, compose } from '../'
import { shallow } from 'enzyme'

test('renameProp renames a single prop', t => {
  const StringConcat = compose(
    withProps({ 'data-so': 123, 'data-la': 456 }),
    renameProp('data-so', 'data-do')
  )('div')

  t.is(StringConcat.displayName, 'withProps(renameProp(div))')

  const div = shallow(<StringConcat />).find('div')
  t.deepEqual(div.props(), { 'data-do': 123, 'data-la': 456 })
})
