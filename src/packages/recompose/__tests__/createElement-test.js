import test from 'ava'
import React, { Component } from 'react'
import createEagerElement from '../createEagerElement'
import { shallow } from 'enzyme'

test('createEagerElement treats class components normally', t => {
  class InnerDiv extends Component {
    render() {
      return <div data-bar="baz" />
    }
  }

  class OuterDiv extends Component {
    render() {
      return createEagerElement('div', { 'data-foo': 'bar' },
        createEagerElement(InnerDiv)
      )
    }
  }

  const wrapper = shallow(<OuterDiv />)

  t.true(wrapper.equals(
    <div data-foo="bar">
      <InnerDiv />
    </div>
  ))
})

test('createEagerElement calls stateless function components instead of creating an intermediate React element', t => {
  const InnerDiv = () => <div data-bar="baz" />
  const OuterDiv = () =>
    createEagerElement('div', { 'data-foo': 'bar' },
      createEagerElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  // Notice the difference between this and the previous test. Functionally,
  // they're the same, but because we're using stateless function components
  // here, createEagerElement() can take advantage of referential transparency
  t.true(wrapper.equals(
    <div data-foo="bar">
      <div data-bar="baz" />
    </div>
  ))
})

test('createEagerElement handles keyed elements correctly', t => {
  const InnerDiv = () => <div data-bar="baz" />
  const Div = () => createEagerElement(
    InnerDiv,
    { 'data-foo': 'bar', key: 'key' }
  )

  const wrapper = shallow(<Div />)

  t.true(wrapper.equals(
    <InnerDiv data-foo="bar" key="key" />
  ))
})

test('createEagerElement passes children correctly', t => {
  const Div = props => <div {...props} />
  const InnerDiv = () => <div data-bar="baz" />
  const OuterDiv = () =>
    createEagerElement(Div, { 'data-foo': 'bar' },
      createEagerElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  t.true(wrapper.equals(
    <div data-foo="bar">
      <div data-bar="baz" />
    </div>
  ))
})
