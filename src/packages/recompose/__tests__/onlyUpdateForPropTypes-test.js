import test from 'ava'
import React from 'react'
import PropTypes from 'prop-types'
import sinon from 'sinon'

import {
  onlyUpdateForPropTypes,
  compose,
  withState,
  setPropTypes
} from '../'

import { mount, shallow } from 'enzyme'

test('onlyUpdateForPropTypes only updates for props specified in propTypes', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForPropTypes,
    setPropTypes({ counter: PropTypes.number })
  )(component)

  t.is(
    Counter.displayName,
    'withState(withState(onlyUpdateForPropTypes(component)))'
  )

  mount(<Counter />)
  const { updateCounter, updateFoobar } = component.firstCall.args[0]

  t.is(component.lastCall.args[0].counter, 0)
  t.is(component.lastCall.args[0].foobar, 'foobar')

  // Does not update
  updateFoobar('barbaz')
  t.true(component.calledOnce)

  updateCounter(42)
  t.true(component.calledTwice)
  t.is(component.lastCall.args[0].counter, 42)
  t.is(component.lastCall.args[0].foobar, 'barbaz')
})

test.serial('onlyUpdateForPropTypes warns if BaseComponent does not have any propTypes', t => {
  const error = sinon.stub(console, 'error')
  const ShouldWarn = onlyUpdateForPropTypes('div')

  shallow(<ShouldWarn />)

  t.is(
    error.firstCall.args[0],
    'A component without any `propTypes` was passed to ' +
    '`onlyUpdateForPropTypes()`. Check the implementation of the component ' +
    'with display name "div".'
  )

  /* eslint-disable */
  console.error.restore()
  /* eslint-enable */
})
