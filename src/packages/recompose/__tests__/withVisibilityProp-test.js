import test from 'ava'
import React from 'react'
import { withVisibilityProp, compose, withState } from '../'
import { mount } from 'enzyme'

test('withVisibilityProp implements shouldComponentUpdate() (for standard property (visible=true))', t => {
  const Counter = compose(
    withState('visible', 'setVisible', true),
    withState('foo', 'updateFoo', 0),
    withVisibilityProp()
  )('div')

  const div = mount(<Counter />).find('div')
  const { setVisible, updateFoo } = div.props()

  t.is(div.prop('visible'), true)
  t.is(div.prop('foo'), 0)

  // Update works for component which is visible
  updateFoo(1)
  t.is(div.prop('foo'), 1)

  // Hide component
  setVisible(false)
  t.is(div.prop('visible'), false)
  t.is(div.prop('foo'), 1)

  // Updated doesn't work for not visible components
  updateFoo(-1)
  t.is(div.prop('foo'), 1)
})

test('withVisibilityProp implements shouldComponentUpdate() (for custom property (isVisible=true))', t => {
  const Counter = compose(
      withState('isVisible', 'setIsVisible', true),
      withState('foo', 'updateFoo', 0),
      withVisibilityProp('isVisible')
  )('div')

  const div = mount(<Counter />).find('div')
  const { setIsVisible, updateFoo } = div.props()

  t.is(div.prop('isVisible'), true)
  t.is(div.prop('foo'), 0)

  // Update works for component which is visible
  updateFoo(1)
  t.is(div.prop('foo'), 1)

  // Hide component
  setIsVisible(false)
  t.is(div.prop('isVisible'), false)
  t.is(div.prop('foo'), 1)

  // Updated doesn't work for hidden components
  updateFoo(-1)
  t.is(div.prop('foo'), 1)
})

test('withVisibilityProp implements shouldComponentUpdate() (for custom property (hidden=false))', t => {
  const Counter = compose(
      withState('hidden', 'setHidden', false),
      withState('foo', 'updateFoo', 0),
      withVisibilityProp('hidden', false)
  )('div')

  const div = mount(<Counter />).find('div')
  const { setHidden, updateFoo } = div.props()

  t.is(div.prop('hidden'), false)
  t.is(div.prop('foo'), 0)

  // Update works for component which is not visible
  updateFoo(1)
  t.is(div.prop('foo'), 1)

  // Hide component
  setHidden(true)
  t.is(div.prop('hidden'), true)
  t.is(div.prop('foo'), 1)

  // Updated doesn't work for hidden components
  updateFoo(-1)
  t.is(div.prop('foo'), 1)
})
