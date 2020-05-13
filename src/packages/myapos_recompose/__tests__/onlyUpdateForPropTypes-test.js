import React from 'react'
import PropTypes from 'prop-types'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import { onlyUpdateForPropTypes, compose, withState, setPropTypes } from '../'

test('onlyUpdateForPropTypes only updates for props specified in propTypes', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForPropTypes,
    setPropTypes({ counter: PropTypes.number })
  )(component)

  expect(Counter.displayName).toBe(
    'withState(withState(onlyUpdateForPropTypes(component)))'
  )

  mount(<Counter />)
  const { updateCounter, updateFoobar } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].foobar).toBe('foobar')

  // Does not update
  updateFoobar('barbaz')
  expect(component.calledOnce).toBe(true)

  updateCounter(42)
  expect(component.calledTwice).toBe(true)
  expect(component.lastCall.args[0].counter).toBe(42)
  expect(component.lastCall.args[0].foobar).toBe('barbaz')
})

test('onlyUpdateForPropTypes warns if BaseComponent does not have any propTypes', () => {
  const error = sinon.stub(console, 'error')
  const ShouldWarn = onlyUpdateForPropTypes('div')

  shallow(<ShouldWarn />)

  expect(error.firstCall.args[0]).toBe(
    'A component without any `propTypes` was passed to ' +
      '`onlyUpdateForPropTypes()`. Check the implementation of the component ' +
      'with display name "div".'
  )

  /* eslint-disable */
  console.error.restore()
  /* eslint-enable */
})
