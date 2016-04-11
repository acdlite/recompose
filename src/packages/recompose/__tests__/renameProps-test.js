import React from 'react'
import { expect } from 'chai'
import { withProps, renameProps, compose } from 'recompose'
import { shallow } from 'enzyme'

describe('renameProps()', () => {
  it('renames props', () => {
    const StringConcat = compose(
      withProps({ so: 123, la: 456 }),
      renameProps({ so: 'do', la: 'fa' })
    )('div')

    expect(StringConcat.displayName).to.equal(
      'withProps(renameProps(div))'
    )

    const div = shallow(<StringConcat />).find('div')

    expect(div.props()).to.eql({ do: 123, fa: 456 })
  })
})
