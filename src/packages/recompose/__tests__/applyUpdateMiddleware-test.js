import React from 'react'
import test from 'ava'
import { withState } from '../'
import applyUpdateMiddleware from '../applyUpdateMiddleware'
import { mount } from 'enzyme'

test('applyUpdateMiddleware composes multiple middleware', t => {
  // Use the middleware from withState to test, for now
  // May want to create a new one, to reduce coupling
  const { middlewares: [m1] } = withState('foo', 'updateFoo', 'foo')
  const { middlewares: [m2] } = withState('bar', 'updateBar', 'bar')
  const { middlewares: [m3] } = withState('baz', 'updateBaz', 'baz')

  const Div = applyUpdateMiddleware(m1, m2, m3)('div')

  const wrapper = mount(<Div />)
  const div = wrapper.find('div')
  const { updateFoo, updateBar, updateBaz } = div.props()

  t.is(div.prop('foo'), 'foo')
  t.is(div.prop('bar'), 'bar')
  t.is(div.prop('baz'), 'baz')

  updateFoo('foo2')
  t.is(div.prop('foo'), 'foo2')

  updateBar('bar2')
  t.is(div.prop('bar'), 'bar2')

  updateBaz('baz2')
  t.is(div.prop('baz'), 'baz2')
})
