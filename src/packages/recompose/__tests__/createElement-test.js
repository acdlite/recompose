import test from 'ava'
import React, { Component } from 'react'
import createEagerElement from '../createEagerElement'
import { shallow } from 'enzyme'

test('createEagerElement treats class components normally', t => {
  class InnerDiv extends Component {
    render() {
      return <div bar="baz" />
    }
  }

  class OuterDiv extends Component {
    render() {
      return createEagerElement('div', { foo: 'bar' },
        createEagerElement(InnerDiv)
      )
    }
  }

  const wrapper = shallow(<OuterDiv />)

  t.true(wrapper.equals(
    <div foo="bar">
      <InnerDiv />
    </div>
  ))
})

test('createEagerElement calls stateless function components instead of creating an intermediate React element', t => {
  const InnerDiv = () => <div bar="baz" />
  const OuterDiv = () =>
    createEagerElement('div', { foo: 'bar' },
      createEagerElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  // Notice the difference between this and the previous test. Functionally,
  // they're the same, but because we're using stateless function components
  // here, createEagerElement() can take advantage of referential transparency
  t.true(wrapper.equals(
    <div foo="bar">
      <div bar="baz" />
    </div>
  ))
})

test('createEagerElement handles keyed elements correctly', t => {
  const InnerDiv = () => <div bar="baz" />
  const Div = () => createEagerElement(InnerDiv, { foo: 'bar', key: 'key' })

  const wrapper = shallow(<Div />)

  t.true(wrapper.equals(
    <InnerDiv foo="bar" key="key" />
  ))
})

test('createEagerElement passes children correctly', t => {
  const Div = props => <div {...props} />
  const InnerDiv = () => <div bar="baz" />
  const OuterDiv = () =>
    createEagerElement(Div, { foo: 'bar' },
      createEagerElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  t.true(wrapper.equals(
    <div foo="bar">
      <div bar="baz" />
    </div>
  ))
})
