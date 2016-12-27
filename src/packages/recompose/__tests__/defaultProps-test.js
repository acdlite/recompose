import test from 'ava'
import React from 'react'
import { defaultProps } from '../'
import { shallow } from 'enzyme'

test('defaultProps passes additional props to base component', t => {
  const DoReMi = defaultProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  t.is(DoReMi.displayName, 'defaultProps(div)')

  const div = shallow(<DoReMi />).find('div')
  t.true(div.equals(<div data-so="do" data-la="fa" />))
})

test('defaultProps has lower precendence than props from owner', t => {
  const DoReMi = defaultProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  t.is(DoReMi.displayName, 'defaultProps(div)')

  const div = shallow(<DoReMi data-la="ti" />).find('div')
  t.true(div.equals(<div data-so="do" data-la="ti" />))
})

test('defaultProps overrides undefined owner props', t => {
  const DoReMi = defaultProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  t.is(DoReMi.displayName, 'defaultProps(div)')

  const div = shallow(<DoReMi data-la={undefined} />).find('div')
  t.true(div.equals(<div data-so="do" data-la="fa" />))
})
