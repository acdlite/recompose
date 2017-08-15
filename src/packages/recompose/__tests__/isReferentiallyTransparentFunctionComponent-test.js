import React, { Component } from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import isReferentiallyTransparentFunctionComponent from '../isReferentiallyTransparentFunctionComponent'

test('isReferentiallyTransparentFunctionComponent returns false for strings', () => {
  expect(isReferentiallyTransparentFunctionComponent('div')).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns false for class components', () => {
  class Foo extends Component {
    render() {
      return <div />
    }
  }

  /* eslint-disable react/prefer-es6-class */
  const Bar = createReactClass({
    render() {
      return <div />
    },
  })
  /* eslint-enable react/prefer-es6-class */

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(false)
  expect(isReferentiallyTransparentFunctionComponent(Bar)).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns true for functions', () => {
  const Foo = props => <div {...props} />

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(true)
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use context', () => {
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.contextTypes = { store: PropTypes.object }

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use default props', () => {
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.defaultProps = { store: PropTypes.object }

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns true for functions that use propTypes', () => {
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.propTypes = { store: PropTypes.object }

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(true)
})
