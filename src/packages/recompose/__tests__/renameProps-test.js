import React from 'react'
import { expect } from 'chai'
import { withProps, renameProps, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('renameProps()', () => {
  it('renames props', () => {
    const spy = createSpy()
    const StringConcat = compose(
      withProps({ so: 123, la: 456 }),
      renameProps({ so: 'do', la: 'fa' }),
      spy
    )('div')

    expect(StringConcat.displayName).to.equal(
      'withProps(renameProps(spy(div)))'
    )

    renderIntoDocument(<StringConcat />)

    expect(spy.getProps()).to.eql({ do: 123, fa: 456 })
  })
})
