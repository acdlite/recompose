import test from 'ava'
import React from 'react'
import { withPropsOnChange, withState, flattenProp, compose } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('withPropsOnChange maps subset of owner props to child props', t => {
  const mapSpy = sinon.spy()
  const StringConcat = compose(
    withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c', d: 'd' }),
    flattenProp('strings'),
    withPropsOnChange(
      ['c', 'd'],
      ({ c, d }) => {
        mapSpy()
        return {
          derived: c + d
        }
      }
    )
  )('div')

  t.is(
    StringConcat.displayName,
    'withState(flattenProp(withPropsOnChange(div)))'
  )

  const div = mount(<StringConcat />).find('div')
  const { updateStrings } = div.props()

  t.is(div.prop('derived'), 'cd')
  t.is(mapSpy.callCount, 1)

  // Does not re-map for non-dependent prop updates
  updateStrings(strings => ({ ...strings, a: 'a2' }))
  t.is(div.prop('a'), 'a2')
  t.is(div.prop('derived'), 'cd')
  t.is(mapSpy.callCount, 1)

  updateStrings(strings => ({ ...strings, c: 'c2', d: 'd2' }))
  t.is(div.prop('derived'), 'c2d2')
  t.is(mapSpy.callCount, 2)
})
