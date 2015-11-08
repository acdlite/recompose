import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { setPropTypes } from 'recompose'

describe('setPropTypes()', () => {
  it('sets a static property on the base component', () => {
    const BaseComponent = () => <div />
    const NewComponent = setPropTypes(
      { foo: PropTypes.object },
      BaseComponent
    )

    expect(NewComponent.propTypes).to.eql({
      foo: PropTypes.object
    })
  })
})
