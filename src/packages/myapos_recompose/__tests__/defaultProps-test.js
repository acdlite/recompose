import React from 'react'
import { shallow } from 'enzyme'
import { defaultProps } from '../'

test('defaultProps passes additional props to base component', () => {
  const DoReMi = defaultProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  expect(DoReMi.displayName).toBe('defaultProps(div)')

  const div = shallow(<DoReMi />).find('div')
  expect(div.equals(<div data-so="do" data-la="fa" />)).toBe(true)
})

test('defaultProps has lower precendence than props from owner', () => {
  const DoReMi = defaultProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  expect(DoReMi.displayName).toBe('defaultProps(div)')

  const div = shallow(<DoReMi data-la="ti" />).find('div')
  expect(div.equals(<div data-so="do" data-la="ti" />)).toBe(true)
})

test('defaultProps overrides undefined owner props', () => {
  const DoReMi = defaultProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  expect(DoReMi.displayName).toBe('defaultProps(div)')

  const div = shallow(<DoReMi data-la={undefined} />).find('div')
  expect(div.equals(<div data-so="do" data-la="fa" />)).toBe(true)
})
