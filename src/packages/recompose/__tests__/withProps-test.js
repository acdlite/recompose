import React from 'react'
import { expect } from 'chai'
import { withProps } from 'recompose'
import { shallow } from 'enzyme'

describe('withProps()', () => {
  it('passes additional props to base component', () => {
    const DoReMi = withProps({ so: 'do', la: 'fa' })('div')

    expect(DoReMi.displayName).to.equal('withProps(div)')

    const div = shallow(<DoReMi />).find('div')
    expect(div.props()).to.eql({ so: 'do', la: 'fa' })
  })

  it('takes precedent over owner props', () => {
    const DoReMi = withProps({ so: 'do', la: 'fa' })('div')

    const div = shallow(<DoReMi la="ti" />).find('div')
    expect(div.props()).to.eql({ so: 'do', la: 'fa' })
  })
})
