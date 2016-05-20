import test from 'ava'
import React, { Component } from 'react'
import isClassComponent from '../isClassComponent'

test('isClassComponent returns false for functions', t => {
  const Foo = () => <div />

  t.false(isClassComponent(Foo))
})

test('isClassComponent returns true for React component classes', t => {
  class Foo extends Component {
    render() {
      return <div />
    }
  }

  /* eslint-disable react/prefer-es6-class */
  const Bar = React.createClass({
    render() {
      return <div />
    }
  })
  /* eslint-enable react/prefer-es6-class */

  t.true(isClassComponent(Foo))
  t.true(isClassComponent(Bar))
})
