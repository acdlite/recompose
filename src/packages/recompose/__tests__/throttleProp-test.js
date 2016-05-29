import test from 'ava'
import React from 'react'
import { throttleProp } from '../'
import { mount } from 'enzyme'

test.cb('throttleProp updates the throttled prop once per wait milliseconds', t => {
  t.plan(15)

  const Counter = throttleProp('throttled', 30)('div')
  t.is(Counter.displayName, 'throttleProp(div)')

  const wrapper = mount(<Counter throttled={0} normal={0} />)
  const div = wrapper.find('div')

  t.is(div.prop('throttled'), 0)
  t.is(div.prop('normal'), 0)

  wrapper.setProps({ throttled: 1, normal: 1 })

  t.is(div.prop('throttled'), 0)
  t.is(div.prop('normal'), 1)

  wrapper.setProps({ throttled: 2, normal: 2 })

  t.is(div.prop('throttled'), 0)
  t.is(div.prop('normal'), 2)

  setTimeout(() => {
    t.is(div.prop('throttled'), 2)
    t.is(div.prop('normal'), 2)

    wrapper.setProps({ throttled: 3, normal: 3 })

    t.is(div.prop('throttled'), 3)
    t.is(div.prop('normal'), 3)

    wrapper.setProps({ throttled: 4, normal: 4 })

    t.is(div.prop('throttled'), 3)
    t.is(div.prop('normal'), 4)

    setTimeout(() => {
      t.is(div.prop('throttled'), 4)
      t.is(div.prop('normal'), 4)
      t.end()
    }, 40)
  }, 40)
})


test.cb('throttleProp cancels the latest update before destroyed', t => {
  t.plan(1)

  const Counter = throttleProp('throttled', 30)('div')
  const wrapper = mount(<Counter throttled={0} />)
  const div = wrapper.find('div')

  wrapper.setProps({ throttled: 1 })

  wrapper.instance().xforms[0].destroy()

  setTimeout(() => {
    t.is(div.prop('throttled'), 0)
    t.end()
  }, 40)
})

