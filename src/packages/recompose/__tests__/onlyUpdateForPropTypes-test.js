import React, { PropTypes } from 'react'
import { expect } from 'chai'

import {
  onlyUpdateForPropTypes,
  compose,
  withState,
  setPropTypes
} from 'recompose'

import { mount, shallow } from 'enzyme'

describe('onlyUpdateForPropTypes()', () => {
  it('only updates for props specified in propTypes', () => {
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      onlyUpdateForPropTypes,
      setPropTypes({ counter: PropTypes.number })
    )(props => <div {...props} />)

    expect(Counter.displayName).to.equal(
      'withState(withState(onlyUpdateForPropTypes(Component)))'
    )

    const div = mount(<Counter />).find('div')
    const { updateCounter, updateFoobar } = div.props()

    expect(div.prop('counter')).to.equal(0)
    expect(div.prop('foobar')).to.equal('foobar')

    // Does not update
    updateFoobar('barbaz')
    expect(div.prop('counter')).to.equal(0)
    expect(div.prop('foobar')).to.equal('foobar')

    updateCounter(42)
    expect(div.prop('counter')).to.equal(42)
    expect(div.prop('foobar')).to.equal('barbaz')
  })

  it('warns if BaseComponent does not have any propTypes', () => {
    const error = sinon.stub(console, 'error')
    const ShouldWarn = onlyUpdateForPropTypes('div')

    shallow(<ShouldWarn />)

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
