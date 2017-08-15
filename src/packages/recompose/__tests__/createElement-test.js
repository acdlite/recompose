import React, { Component } from 'react'
import { shallow } from 'enzyme'
import createEagerElement from '../createEagerElement'

const origNodeEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = origNodeEnv
})

test('createEagerElement treats class components normally', () => {
  class InnerDiv extends Component {
    render() {
      return <div data-bar="baz" />
    }
  }

  class OuterDiv extends Component {
    render() {
      return createEagerElement(
        'div',
        { 'data-foo': 'bar' },
        createEagerElement(InnerDiv)
      )
    }
  }

  const wrapper = shallow(<OuterDiv />)

  expect(
    wrapper.equals(
      <div data-foo="bar">
        <InnerDiv />
      </div>
    )
  ).toBe(true)
})

test('createEagerElement calls stateless function components instead of creating an intermediate React element', () => {
  process.env.NODE_ENV = 'production'
  const InnerDiv = () => <div data-bar="baz" />
  const OuterDiv = () =>
    createEagerElement(
      'div',
      { 'data-foo': 'bar' },
      createEagerElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  // Notice the difference between this and the previous test. Functionally,
  // they're the same, but because we're using stateless function components
  // here, createEagerElement() can take advantage of referential transparency
  expect(
    wrapper.equals(
      <div data-foo="bar">
        <div data-bar="baz" />
      </div>
    )
  ).toBe(true)
})

test('createEagerElement handles keyed elements correctly', () => {
  const InnerDiv = () => <div data-bar="baz" />
  const Div = () =>
    createEagerElement(InnerDiv, { 'data-foo': 'bar', key: 'key' })

  const wrapper = shallow(<Div />)

  expect(wrapper.equals(<InnerDiv data-foo="bar" key="key" />)).toBe(true)
})

test('createEagerElement passes children correctly', () => {
  process.env.NODE_ENV = 'production'
  const Div = props => <div {...props} />
  const InnerDiv = () => <div data-bar="baz" />
  const OuterDiv = () =>
    createEagerElement(Div, { 'data-foo': 'bar' }, createEagerElement(InnerDiv))

  const wrapper = shallow(<OuterDiv />)

  expect(
    wrapper.equals(
      <div data-foo="bar">
        <div data-bar="baz" />
      </div>
    )
  ).toBe(true)
})
