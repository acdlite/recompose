import test from 'ava'
import React, { Component } from 'react'
import createElement from '../createElement'
import { shallow } from 'enzyme'

test('createElement treats class components normally', t => {
  class InnerDiv extends Component {
    render() {
      return <div bar="baz" />
    }
  }

  class OuterDiv extends Component {
    render() {
      return createElement('div', { foo: 'bar' },
        createElement(InnerDiv)
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

test('createElement calls stateless function components instead of creating an intermediate React element', t => {
  const InnerDiv = () => <div bar="baz" />
  const OuterDiv = () =>
    createElement('div', { foo: 'bar' },
      createElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  // Notice the difference between this and the previous test. Functionally,
  // they're the same, but because we're using stateless function components
  // here, createElement() can take advantage of referential transparency
  t.true(wrapper.equals(
    <div foo="bar">
      <div bar="baz" />
    </div>
  ))
})

test('createElement handles keyed elements correctly', t => {
  const InnerDiv = () => <div bar="baz" />
  const Div = () => createElement(InnerDiv, { foo: 'bar', key: 'key' })

  const wrapper = shallow(<Div />)

  t.true(wrapper.equals(
    <InnerDiv foo="bar" key="key" />
  ))
})

test('createElement passes children correctly', t => {
  const Div = props => <div {...props} />
  const InnerDiv = () => <div bar="baz" />
  const OuterDiv = () =>
    createElement(Div, { foo: 'bar' },
      createElement(InnerDiv)
    )

  const wrapper = shallow(<OuterDiv />)

  t.true(wrapper.equals(
    <div foo="bar">
      <div bar="baz" />
    </div>
  ))
})
