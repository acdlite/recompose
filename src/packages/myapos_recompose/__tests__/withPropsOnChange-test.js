import * as React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import {
  withPropsOnChange,
  withState,
  withStateHandlers,
  flattenProp,
  compose,
} from '../'

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

test('withPropsOnChange maps subset of owner props to child props with custom predicate', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const mapSpy = sinon.spy()
  const shouldMapSpy = sinon.spy()
  const PageContainer = compose(
    withStateHandlers(
      { result: { hasError: false, loading: true, error: null } },
      {
        updateResult: ({ result }) => payload => ({
          result: { ...result, ...payload },
        }),
      }
    ),
    withPropsOnChange(
      ({ result }, { result: nextResult }) => {
        shouldMapSpy(result, nextResult)
        return !result.hasError && nextResult.hasError
      },
      ({ result: { hasError, error } }) => {
        mapSpy()

        if (hasError) {
          return {
            errorEverHappened: true,
            lastError: error,
          }
        }

        return {
          errorEverHappened: false,
        }
      }
    )
  )(component)

  expect(PageContainer.displayName).toBe(
    'withStateHandlers(withPropsOnChange(component))'
  )

  mount(<PageContainer />)
  const { updateResult } = component.firstCall.args[0]
  expect(component.lastCall.args[0].errorEverHappened).toBe(false)
  expect(component.lastCall.args[0].lastError).toBeUndefined()
  expect(component.calledOnce).toBe(true)
  expect(mapSpy.callCount).toBe(1)
  expect(shouldMapSpy.callCount).toBe(1)

  updateResult({ loading: false, hasError: true, error: '1' })
  expect(component.lastCall.args[0].errorEverHappened).toBe(true)
  expect(component.lastCall.args[0].lastError).toBe('1')
  expect(component.calledTwice).toBe(true)
  expect(mapSpy.callCount).toBe(2)

  // Does not re-map for false map result
  updateResult({ loading: true, hasError: false, error: null })
  expect(component.lastCall.args[0].errorEverHappened).toBe(true)
  expect(component.lastCall.args[0].lastError).toBe('1')
  expect(component.calledThrice).toBe(true)
  expect(mapSpy.callCount).toBe(2)

  updateResult({ loading: false, hasError: true, error: '2' })
  expect(component.lastCall.args[0].errorEverHappened).toBe(true)
  expect(component.lastCall.args[0].lastError).toBe('2')
  expect(component.callCount).toBe(4)
  expect(mapSpy.callCount).toBe(3)
})
