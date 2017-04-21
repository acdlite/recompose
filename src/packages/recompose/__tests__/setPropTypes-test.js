import React from 'react'
import PropTypes from 'prop-types'
import { setPropTypes } from '../'

test('setPropTypes sets a static property on the base component', () => {
  const BaseComponent = () => <div />
  const NewComponent = setPropTypes({ foo: PropTypes.object })(BaseComponent)

  expect(NewComponent.propTypes).toEqual({
    foo: PropTypes.object,
  })
})
