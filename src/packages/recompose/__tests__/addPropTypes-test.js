import test from 'ava'
import React, { PropTypes } from 'react'
import { addPropTypes } from '../'

test('addPropTypes adds proptypes on the base component which has no proptypes', t => {
  const BaseComponent = () => <div />

  const NewComponent = addPropTypes(
    { foo: PropTypes.object }
  )(BaseComponent)

  t.deepEqual(NewComponent.propTypes, {
    foo: PropTypes.object
  })
})

test('addPropTypes adds proptypes on the base component which has existing proptypes', t => {
  const BaseComponent = () => <div />
  BaseComponent.propTypes = {
    a: PropTypes.string.isRequired,
    b: PropTypes.string
  }
  const NewComponent = addPropTypes(
    { foo: PropTypes.object }
  )(BaseComponent)

  t.deepEqual(NewComponent.propTypes, {
    a: PropTypes.string.isRequired,
    b: PropTypes.string,
    foo: PropTypes.object
  })
})

test('addPropTypes adds proptypes on the base component which already has some similar proptypes', t => {
  const BaseComponent = () => <div />
  BaseComponent.propTypes = {
    a: PropTypes.string.isRequired,
    b: PropTypes.string
  }
  const NewComponent = addPropTypes(
    { a: PropTypes.object }
  )(BaseComponent)

  t.deepEqual(NewComponent.propTypes, {
    a: PropTypes.object,
    b: PropTypes.string
  })
})
