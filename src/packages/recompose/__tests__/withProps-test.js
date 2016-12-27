import test from 'ava'
import React from 'react'
import { withProps } from '../'
import { shallow } from 'enzyme'

test('withProps passes additional props to base component', t => {
  const DoReMi = withProps({ 'data-so': 'do', 'data-la': 'fa' })('div')
  t.is(DoReMi.displayName, 'withProps(div)')

  const div = shallow(<DoReMi />).find('div')
  t.is(div.prop('data-so'), 'do')
  t.is(div.prop('data-la'), 'fa')
})

test('withProps takes precedent over owner props', t => {
  const DoReMi = withProps({ 'data-so': 'do', 'data-la': 'fa' })('div')

  const div = shallow(<DoReMi data-la="ti" />).find('div')
  t.is(div.prop('data-so'), 'do')
  t.is(div.prop('data-la'), 'fa')
})

test('withProps should accept function', t => {
  const DoReMi = withProps((props) => ({
    'data-so': props['data-la']
  }))('div')

  const div = shallow(<DoReMi data-la="la" />).find('div')
  t.is(div.prop('data-so'), 'la')
})
