import test from 'ava'
import React from 'react'
import { withProps } from '../'
import { shallow } from 'enzyme'

test('withProps passes additional props to base component', t => {
  const DoReMi = withProps({ so: 'do', la: 'fa' })('div')
  t.is(DoReMi.displayName, 'withProps(div)')

  const div = shallow(<DoReMi />).find('div')
  t.is(div.prop('so'), 'do')
  t.is(div.prop('la'), 'fa')
})

test('withProps takes precedent over owner props', t => {
  const DoReMi = withProps({ so: 'do', la: 'fa' })('div')

  const div = shallow(<DoReMi la="ti" />).find('div')
  t.is(div.prop('so'), 'do')
  t.is(div.prop('la'), 'fa')
})

test('withProps should accept function', t => {
  const DoReMi = withProps(({ la }) => ({
    so: la,
  }))('div')

  const div = shallow(<DoReMi la="la" />).find('div')
  t.is(div.prop('so'), 'la')
})
