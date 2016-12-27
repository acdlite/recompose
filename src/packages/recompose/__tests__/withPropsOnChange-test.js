import test from 'ava'
import React from 'react'
import { withPropsOnChange, withState, flattenProp, compose } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('withPropsOnChange maps subset of owner props to child props', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

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
  )(component)

  t.is(
    StringConcat.displayName,
    'withState(flattenProp(withPropsOnChange(component)))'
  )

  mount(<StringConcat />)
  const { updateStrings } = component.firstCall.args[0]
  t.is(component.lastCall.args[0].foobar, 'ab')
  t.true(component.calledOnce)
  t.is(mapSpy.callCount, 1)

  // Does not re-map for non-dependent prop updates
  updateStrings(strings => ({ ...strings, c: 'baz' }))
  t.is(component.lastCall.args[0].foobar, 'ab')
  t.is(component.lastCall.args[0].c, 'c')
  t.true(component.calledTwice)
  t.is(mapSpy.callCount, 1)

  updateStrings(strings => ({ ...strings, a: 'foo', b: 'bar' }))
  t.is(component.lastCall.args[0].foobar, 'foobar')
  t.is(component.lastCall.args[0].c, 'baz')
  t.true(component.calledThrice)
  t.is(mapSpy.callCount, 2)
})
