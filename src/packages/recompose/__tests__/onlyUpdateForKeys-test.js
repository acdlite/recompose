import test from 'ava'
import React from 'react'
import { onlyUpdateForKeys, compose, withState } from '../'
import { mount } from 'enzyme'

test('onlyUpdateForKeys implements shouldComponentUpdate()', t => {
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForKeys(['counter'])
  )('div')

  t.is(Counter.displayName, 'withState(withState(onlyUpdateForKeys(div)))')

  const div = mount(<Counter />).find('div')
  const { updateCounter, updateFoobar } = div.props()

  t.is(div.prop('counter'), 0)
  t.is(div.prop('foobar'), 'foobar')

  // Does not update
  updateFoobar('barbaz')
  t.is(div.prop('counter'), 0)
  t.is(div.prop('foobar'), 'foobar')

  updateCounter(42)
  t.is(div.prop('counter'), 42)
  t.is(div.prop('foobar'), 'barbaz')
})
