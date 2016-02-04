import React, { PropTypes } from 'react'
import { expect } from 'chai'
import omit from 'lodash/omit'

import {
  onlyUpdateForPropTypes,
  compose,
  withState,
  setPropTypes
} from 'recompose'

import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('onlyUpdateForPropTypes()', () => {
  it('only updates for props specified in propTypes', () => {
    const spy = createSpy()
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      onlyUpdateForPropTypes,
      setPropTypes({ counter: PropTypes.number }),
      spy
    )('div')

    expect(Counter.displayName).to.equal(
      'withState(withState(onlyUpdateForPropTypes(spy(div))))'
    )

    renderIntoDocument(<Counter pass="through" />)

    expect(omit(spy.getProps(), ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 0,
      foobar: 'foobar',
      pass: 'through'
    })
    expect(spy.getRenderCount()).to.equal(1)

    spy.getProps().updateFoobar(() => 'barbaz')
    expect(omit(spy.getProps(), ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 0,
      foobar: 'foobar',
      pass: 'through'
    })
    expect(spy.getRenderCount()).to.equal(1)

    spy.getProps().updateCounter(n => n + 1)
    expect(omit(spy.getProps(), ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 1,
      pass: 'through',
      foobar: 'barbaz'
    })
    expect(spy.getRenderCount()).to.equal(2)
  })

  it('warns if BaseComponent does not have any propTypes', () => {
    const error = sinon.stub(console, 'error')

    const ShouldWarn = onlyUpdateForPropTypes('div')

    renderIntoDocument(<ShouldWarn />)

    expect(error.firstCall.args[0]).to.equal(
      'A component without any `propTypes` was passed to ' +
      '`onlyUpdateForPropTypes()`. Check the implementation of the component ' +
      'with display name "div".'
    )

    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })
})
