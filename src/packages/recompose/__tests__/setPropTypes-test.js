import test from 'ava'
import React from 'react'
import PropTypes from 'prop-types'
import { setPropTypes } from '../'

test('setPropTypes sets a static property on the base component', t => {
  const BaseComponent = () => <div />
  const NewComponent = setPropTypes(
    { foo: PropTypes.object }
  )(BaseComponent)

  t.deepEqual(NewComponent.propTypes, {
    foo: PropTypes.object
  })
})
