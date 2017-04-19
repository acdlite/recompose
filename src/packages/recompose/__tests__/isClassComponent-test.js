import React, { Component } from 'react'
import createReactClass from 'create-react-class'
import isClassComponent from '../isClassComponent'

test('isClassComponent returns false for functions', () => {
  const Foo = () => <div />

  expect(isClassComponent(Foo)).toBe(false)
})

test('isClassComponent returns true for React component classes', () => {
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

  expect(isClassComponent(Foo)).toBe(true)
  expect(isClassComponent(Bar)).toBe(true)
})
