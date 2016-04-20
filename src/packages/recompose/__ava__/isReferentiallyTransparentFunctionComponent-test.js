import test from 'ava'
import React, { Component, PropTypes } from 'react'
import isReferentiallyTransparentFunctionComponent
  from '../isReferentiallyTransparentFunctionComponent'

test('isReferentiallyTransparentFunctionComponent returns false for strings', t => {
  t.false(isReferentiallyTransparentFunctionComponent('div'))
})

test('isReferentiallyTransparentFunctionComponent returns false for class components', t => {
  class Foo extends Component {
    render() {
      return <div />
    }
  }

  const Bar = React.createClass({
    render() {
      return <div />
    }
  })

  t.false(isReferentiallyTransparentFunctionComponent(Foo))
  t.false(isReferentiallyTransparentFunctionComponent(Bar))
})

test('isReferentiallyTransparentFunctionComponent returns true for functions', t => {
  const Foo = props => <div {...props} />

  t.true(isReferentiallyTransparentFunctionComponent(Foo))
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use context', t => {
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.contextTypes = { store: PropTypes.object }

  t.false(isReferentiallyTransparentFunctionComponent(Foo))
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use default props', t => {
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.defaultProps = { store: PropTypes.object }

  t.false(isReferentiallyTransparentFunctionComponent(Foo))
})

test('isReferentiallyTransparentFunctionComponent returns false for functions that use propTypes', t => {
  const Foo = (props, context) => <div {...props} {...context} />
  Foo.propTypes = { store: PropTypes.object }

  t.false(isReferentiallyTransparentFunctionComponent(Foo))
})
