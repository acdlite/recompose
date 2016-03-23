import React from 'react'
import { expect } from 'chai'
import { defaultProps, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('defaultProps()', () => {
  const spy = createSpy()
  const DoReMi = compose(
    defaultProps({ so: 'do', la: 'fa' }),
    spy
  )('div')

  it('passes additional props to base component', () => {
    expect(DoReMi.displayName)
      .to.equal('defaultProps(spy(div))')

    renderIntoDocument(<DoReMi />)

    expect(spy.getProps()).to.eql({ so: 'do', la: 'fa' })
  })

  it('owner props take precendence', () => {
    renderIntoDocument(<DoReMi la="ti" />)

    expect(spy.getProps()).to.eql({ so: 'do', la: 'ti' })
  })

  it('it overrides undefined owner props', () => {
    renderIntoDocument(<DoReMi la={undefined} />)

    expect(spy.getProps()).to.eql({ so: 'do', la: 'fa' })
  })
})
