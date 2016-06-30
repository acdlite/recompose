import React from 'react'
import test from 'ava'
import { mount } from 'enzyme'
import { asyncMapPropsOnChange } from '../'

const delay = (time = 0) =>
  new Promise(resolve => setTimeout(resolve, time))

test('asyncMapPropsOnChange fetches props asynchronously', async t => {
  const enhance = asyncMapPropsOnChange(
    ['a', 'b'],
    ({ a, b }) => Promise.resolve({ c: a + b })
  )
  const Div = enhance('div')
  const wrapper = mount(<Div a={1} b={2} />)

  await delay()
  const div = wrapper.find('div')
  t.is(div.prop('a'), 1)
  t.is(div.prop('b'), 2)
  t.is(div.prop('c'), 3)

  wrapper.setProps({ a: 2, b: 4 })
  t.is(div.prop('a'), 2) // Updates immediately
  t.is(div.prop('b'), 4)
  t.is(div.prop('c'), 3) // Will not update until next tick
  await delay()
  t.is(div.prop('a'), 2)
  t.is(div.prop('b'), 4)
  t.is(div.prop('c'), 6) // Updated
})
