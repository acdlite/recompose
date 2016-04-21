import test from 'ava'
import React from 'react'
import { withPropsOnChange, withState, flattenProp, compose } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('withPropsOnChange maps subset of owner props to child props', t => {
  const mapSpy = sinon.spy()
  const StringConcat = compose(
    withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
    flattenProp('strings'),
    withPropsOnChange(
      ['a', 'b'],
      ({ a, b, ...props }) => {
        mapSpy()
        return {
          ...props,
          foobar: a + b
        }
      }
    )
  )('div')

  t.is(StringConcat.displayName, 'withState(flattenProp(withPropsOnChange(div)))')

  const div = mount(<StringConcat />).find('div')
  const { updateStrings } = div.props()

  t.is(div.prop('foobar'), 'ab')
  t.is(mapSpy.callCount, 1)

  // Does not re-map for non-dependent prop updates
  updateStrings(strings => ({ ...strings, c: 'baz' }))
  t.is(div.prop('foobar'), 'ab')
  t.is(div.prop('c'), 'c')
  t.is(mapSpy.callCount, 1)

  updateStrings(strings => ({ ...strings, a: 'foo', 'b': 'bar' }))
  t.is(div.prop('foobar'), 'foobar')
  t.is(div.prop('c'), 'baz')
  t.is(mapSpy.callCount, 2)
})
