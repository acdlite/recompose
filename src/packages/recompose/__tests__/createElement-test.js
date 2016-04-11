import React, { Component } from 'react'
import createElement from '../createElement'
import { expect } from 'chai'
import { shallow } from 'enzyme'

// These tests use the shallow renderer to inspect the React elements that are
// owned by a component.
describe('createElement()', () => {
  it('treats class components normally', () => {
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

    expect(wrapper.equals(
      <div foo="bar">
        <InnerDiv />
      </div>
    )).to.be.true
  })

  it('calls stateless function components instead of creating an intermediate React element', () => {
    const InnerDiv = () => <div bar="baz" />
    const OuterDiv = () =>
      createElement('div', { foo: 'bar' },
        createElement(InnerDiv)
      )

    const wrapper = shallow(<OuterDiv />)

    // Notice the difference between this and the previous test. Functionally,
    // they're the same, but because we're using stateless function components
    // here, createElement() can take advantage of referential transparency
    expect(wrapper.equals(
      <div foo="bar">
        <div bar="baz" />
      </div>
    )).to.be.true
  })

  it('handles keyed elements correctly', () => {
    const InnerDiv = () => <div bar="baz" />
    const Div = () => createElement(InnerDiv, { foo: 'bar', key: 'key' })

    const wrapper = shallow(<Div />)

    expect(wrapper.equals(
      <InnerDiv foo="bar" key="key" />
    )).to.be.true
  })

  it('passes children correctly', () => {
    const Div = props => <div {...props} />
    const InnerDiv = () => <div bar="baz" />
    const OuterDiv = () =>
      createElement(Div, { foo: 'bar' },
        createElement(InnerDiv)
      )

    const wrapper = shallow(<OuterDiv />)

    expect(wrapper.equals(
      <div foo="bar">
        <div bar="baz" />
      </div>
    )).to.be.true
  })
})
