import test from 'ava'
import React from 'react'
import { defaultProps } from '../'
import { shallow } from 'enzyme'

test('defaultProps passes additional props to base component', t => {
  const DoReMi = defaultProps({ so: 'do', la: 'fa' })('div')
  t.is(DoReMi.displayName, 'defaultProps(div)')

  const div = shallow(<DoReMi />).find('div')
  t.true(div.equals(<div so="do" la="fa" />))
})

test('defaultProps has lower precendence than props from owner', t => {
  const DoReMi = defaultProps({ so: 'do', la: 'fa' })('div')
  t.is(DoReMi.displayName, 'defaultProps(div)')

  const div = shallow(<DoReMi la="ti" />).find('div')
  t.true(div.equals(<div so="do" la="ti" />))
})

test('defaultProps overrides undefined owner props', t => {
  const DoReMi = defaultProps({ so: 'do', la: 'fa' })('div')
  t.is(DoReMi.displayName, 'defaultProps(div)')

  const div = shallow(<DoReMi la={undefined} />).find('div')
  t.true(div.equals(<div so="do" la="fa" />))
})
