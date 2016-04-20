import test from 'ava'
import React from 'react'
import { withProps, renameProp, compose } from '../'
import { shallow } from 'enzyme'

test('renameProp renames a single prop', t => {
  const StringConcat = compose(
    withProps({ so: 123, la: 456 }),
    renameProp('so', 'do')
  )('div')

  t.is(StringConcat.displayName, 'withProps(renameProp(div))')

  const div = shallow(<StringConcat />).find('div')
  t.deepEqual(div.props(), { do: 123, la: 456 })
})
