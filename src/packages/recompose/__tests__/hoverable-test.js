import React from 'react'
import { shallow } from 'enzyme'
import { hoverable } from '../'

test('hoverable default state is false and passes props to base', () => {
  const DoReMi = hoverable('hov')('span')

  expect(DoReMi.displayName).toBe('hoverable(div(span))')

  const wrapper = shallow(<DoReMi />)
  const div = wrapper.find('span')
  expect(div.prop('hov')).toBe(false)
})

test('hoverable updates state when mouse enters and leaves', () => {
  const DoReMi = hoverable('hov')('span')
  const wrapper = shallow(<DoReMi />)

  wrapper.find('div').simulate('mouseEnter')
  expect(wrapper.find('span').prop('hov')).toBe(true)

  wrapper.find('div').simulate('mouseLeave')
  expect(wrapper.find('span').prop('hov')).toBe(false)
})
