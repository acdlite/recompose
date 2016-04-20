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

  const Bar = React.createClass({
    render() {
      return <div />
    }
  })

  t.true(isClassComponent(Foo))
  t.true(isClassComponent(Bar))
})
