import React from 'react'
import PropTypes from 'prop-types'
import { setStatic } from '../'

test('setStatic sets a static property on the base component', () => {
  const BaseComponent = () => <div />
  const NewComponent = setStatic('propTypes', { foo: PropTypes.object })(
    BaseComponent
  )

  expect(NewComponent.propTypes).toEqual({
    foo: PropTypes.object,
  })
})
