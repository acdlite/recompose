import React from 'react'
import { expect } from 'chai'
import { withProps, renameProp, compose } from 'recompose'
import { shallow } from 'enzyme'

describe('renameProp()', () => {
  it('renames a single prop', () => {
    const StringConcat = compose(
      withProps({ so: 123, la: 456 }),
      renameProp('so', 'do')
    )('div')

    expect(StringConcat.displayName).to.equal(
      'withProps(renameProp(div))'
    )

    const div = shallow(<StringConcat />).find('div')
    expect(div.props()).to.eql({ do: 123, la: 456 })
  })
})
