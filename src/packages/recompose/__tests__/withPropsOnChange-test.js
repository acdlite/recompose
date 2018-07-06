import * as React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { withPropsOnChange, withState, flattenProp, compose } from '../'

test('withPropsOnChange maps subset of owner props to child props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const mapSpy = sinon.spy()
  const StringConcat = compose(
    withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
    flattenProp('strings'),
    withPropsOnChange(['a', 'b'], ({ a, b, ...props }) => {
      mapSpy()
      return {
        ...props,
        foobar: a + b,
      }
    })
  )(component)

  expect(StringConcat.displayName).toBe(
    'withState(flattenProp(withPropsOnChange(component)))'
  )

  mount(<StringConcat />)
  const { updateStrings } = component.firstCall.args[0]
  expect(component.lastCall.args[0].foobar).toBe('ab')
  expect(component.calledOnce).toBe(true)
  expect(mapSpy.callCount).toBe(1)

  // Does not re-map for non-dependent prop updates
  updateStrings(strings => ({ ...strings, c: 'baz' }))
  expect(component.lastCall.args[0].foobar).toBe('ab')
  expect(component.lastCall.args[0].c).toBe('c')
  expect(component.calledTwice).toBe(true)
  expect(mapSpy.callCount).toBe(1)

  updateStrings(strings => ({ ...strings, a: 'foo', b: 'bar' }))
  expect(component.lastCall.args[0].foobar).toBe('foobar')
  expect(component.lastCall.args[0].c).toBe('baz')
  expect(component.calledThrice).toBe(true)
  expect(mapSpy.callCount).toBe(2)
})

test('withPropsOnChange maps subset of owner props to child props with shouldMap function', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const mapSpy = sinon.spy()
  const StringConcat = compose(
    withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
    flattenProp('strings'),
    withPropsOnChange(
      ({ a, b }, { a: nextA, b: nextB }) => a !== nextA && b !== nextB,
      ({ a, b, ...props }) => {
        mapSpy()
        return {
          ...props,
          foobar: a + b,
        }
      }
    )
  )(component)

  expect(StringConcat.displayName).toBe(
    'withState(flattenProp(withPropsOnChange(component)))'
  )

  mount(<StringConcat />)
  const { updateStrings } = component.firstCall.args[0]
  expect(component.lastCall.args[0].foobar).toBe('ab')
  expect(component.calledOnce).toBe(true)
  expect(mapSpy.callCount).toBe(1)

  // Does not re-map unless both props change
  updateStrings(strings => ({ ...strings, a: 'foo' }))
  expect(component.lastCall.args[0].foobar).toBe('ab')
  expect(component.lastCall.args[0].c).toBe('c')
  expect(component.calledTwice).toBe(true)
  expect(mapSpy.callCount).toBe(1)

  // Previous state is consistent, won't re-map
  updateStrings(strings => ({ ...strings, a: 'foo', b: 'bar' }))
  expect(component.lastCall.args[0].foobar).toBe('ab')
  expect(component.lastCall.args[0].c).toBe('c')
  expect(component.calledThrice).toBe(true)
  expect(mapSpy.callCount).toBe(1)

  // Re-maps when both props change
  updateStrings(strings => ({ ...strings, a: 'y', b: 'z', c: 'baz' }))
  expect(component.lastCall.args[0].foobar).toBe('yz')
  expect(component.lastCall.args[0].c).toBe('baz')
  expect(component.callCount).toBe(4)
  expect(mapSpy.callCount).toBe(2)

  // Does not re-map irrelevant prop updates
  updateStrings(strings => ({ ...strings, c: 'q' }))
  expect(component.lastCall.args[0].foobar).toBe('yz')
  expect(component.lastCall.args[0].c).toBe('baz')
  expect(component.callCount).toBe(5)
  expect(mapSpy.callCount).toBe(2)
  expect(mapSpy.callCount).toBe(2)
})
