import test from 'ava'
import React, { PropTypes } from 'react'
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
