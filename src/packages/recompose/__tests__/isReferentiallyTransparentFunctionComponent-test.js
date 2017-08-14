import React, { Component } from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import isReferentiallyTransparentFunctionComponent from '../isReferentiallyTransparentFunctionComponent'

const origNodeEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = origNodeEnv
})

test('isReferentiallyTransparentFunctionComponent returns false in non-production env', () => {
  const Foo = props => <div {...props} />

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns false for strings', () => {
  expect(isReferentiallyTransparentFunctionComponent('div')).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns false for class components', () => {
  process.env.NODE_ENV = 'production'

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
  process.env.NODE_ENV = 'production'
  const Foo = props => <div {...props} />

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(true)
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use context', () => {
  process.env.NODE_ENV = 'production'
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.contextTypes = { store: PropTypes.object }

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use default props', () => {
  process.env.NODE_ENV = 'production'
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.defaultProps = { store: PropTypes.object }

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(false)
})

test('isReferentiallyTransparentFunctionComponent returns true for functions that use propTypes', () => {
  process.env.NODE_ENV = 'production'
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.propTypes = { store: PropTypes.object }

  expect(isReferentiallyTransparentFunctionComponent(Foo)).toBe(true)
})
