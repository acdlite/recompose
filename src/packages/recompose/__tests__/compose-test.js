import React from 'react'
import { expect } from 'chai'
import { compose, mapProps, setDisplayName } from 'recompose'
import identity from 'lodash/identity'

describe('compose()', () => {
  const BaseComponent = setDisplayName('BaseComponent', () => <div />)

  it('warns if higher-order component helper has too few arguments applied', () => {
    const error = sinon.stub(console, 'error')

    compose(
      mapProps(),
      mapProps(identity)
    )(BaseComponent)

    expect(error.callCount).to.equal(1)
    expect(error.firstCall.args[0]).to.equal(
      'Attempted to compose `mapProps()` with other higher-order component ' +
      'helpers, but it has been applied with 1 too few parameters. Check the ' +
      'implementation of <BaseComponent>.'
    )

    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })

  it('does not warn if helper is under-applied, but none of the other functions are applied helpers', () => {
    const error = sinon.stub(console, 'error')

    compose(
      mapProps(),
      identity
    )(BaseComponent)

    expect(error.callCount).to.equal(0)

    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })
})
