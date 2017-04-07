import test from 'ava'
import React from 'react'
import PropTypes from 'prop-types'
import { setStatic } from '../'

test('setStatic sets a static property on the base component', t => {
  const BaseComponent = () => <div />
  const NewComponent = setStatic(
    'propTypes',
    { foo: PropTypes.object }
  )(BaseComponent)

  t.deepEqual(NewComponent.propTypes, {
    foo: PropTypes.object
  })
})
