import React from 'react'
import { shallow } from 'enzyme'
import { withProps } from '../'

test('withProps passes additional props to base component', () => {
  const DoReMi = withProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  expect(DoReMi.displayName).toBe('withProps(div)')

  const div = shallow(<DoReMi />).find('div')
  expect(div.prop('data-so')).toBe('do')
  expect(div.prop('data-la')).toBe('fa')
})

test('withProps takes precedent over owner props', () => {
  const DoReMi = withProps({ 'data-so': 'do', 'data-la': 'fa' })('div')

  const div = shallow(<DoReMi data-la="ti" />).find('div')
  expect(div.prop('data-so')).toBe('do')
  expect(div.prop('data-la')).toBe('fa')
})

test('withProps should accept function', () => {
  const DoReMi = withProps(props => ({
    'data-so': props['data-la'],
  }))('div')

  const div = shallow(<DoReMi data-la="la" />).find('div')
  expect(div.prop('data-so')).toBe('la')
})
