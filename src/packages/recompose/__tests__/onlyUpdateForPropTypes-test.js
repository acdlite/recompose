import test from 'ava'
import React, { PropTypes } from 'react'
import sinon from 'sinon'

import {
  onlyUpdateForPropTypes,
  compose,
  withState,
  setPropTypes
} from '../'

import { mount, shallow } from 'enzyme'

test('onlyUpdateForPropTypes only updates for props specified in propTypes', t => {
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForPropTypes,
    setPropTypes({ counter: PropTypes.number })
  )(props => <div {...props} />)

  t.is(Counter.displayName, 'withState(withState(onlyUpdateForPropTypes(Component)))')

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
