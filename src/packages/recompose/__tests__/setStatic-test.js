import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { setStatic } from 'recompose'

describe('setStatic()', () => {
  it('sets a static property on the base component', () => {
    const BaseComponent = () => <div />
    const NewComponent = setStatic(
      'propTypes',
      { foo: PropTypes.object },
      BaseComponent
    )

    expect(NewComponent.propTypes).to.eql({
      foo: PropTypes.object
    })
  })
})
