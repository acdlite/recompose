import React from 'react'
import { expect } from 'chai'
import { defaultProps } from 'recompose'
import { shallow } from 'enzyme'

describe('defaultProps()', () => {
  it('passes additional props to base component', () => {
    const DoReMi = defaultProps({ so: 'do', la: 'fa' })('div')
    expect(DoReMi.displayName)
      .to.equal('defaultProps(div)')

    const div = shallow(<DoReMi />).find('div')
    expect(div.equals(<div so="do" la="fa" />)).to.be.true
  })

  it('owner props take precendence', () => {
    const DoReMi = defaultProps({ so: 'do', la: 'fa' })('div')
    expect(DoReMi.displayName)
      .to.equal('defaultProps(div)')

    const div = shallow(<DoReMi la="ti" />).find('div')
    expect(div.equals(<div so="do" la="ti" />)).to.be.true
  })

  it('overrides undefined owner props', () => {
    const DoReMi = defaultProps({ so: 'do', la: 'fa' })('div')
    expect(DoReMi.displayName)
      .to.equal('defaultProps(div)')

    const div = shallow(<DoReMi la={undefined} />).find('div')
    expect(div.equals(<div so="do" la="fa" />)).to.be.true
  })
})
