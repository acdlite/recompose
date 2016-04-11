import React from 'react'
import { expect } from 'chai'
import { withState } from 'recompose'
import { mount } from 'enzyme'

describe('withState()', () => {
  it('adds a stateful value and a function for updating it', () => {
    const Counter = withState('counter', 'updateCounter', 0)('div')
    expect(Counter.displayName).to.equal(
      'withState(div)'
    )

    const div = mount(<Counter pass="through" />).find('div')
    const { updateCounter } = div.props()

    expect(div.prop('counter')).to.equal(0)
    expect(div.prop('pass')).to.equal('through')

    updateCounter(n => n + 9)
    updateCounter(n => n * 2)
    expect(div.prop('counter')).to.equal(18)
    expect(div.prop('pass')).to.equal('through')
  })

  it('also accepts a non-function, which is passed directly to setState()', () => {
    const Counter = withState('counter', 'updateCounter', 0)('div')
    const div = mount(<Counter />).find('div')
    const { updateCounter } = div.props()

    updateCounter(18)
    expect(div.prop('counter')).to.equal(18)
  })

  it('accepts setState() callback', () => {
    const Counter = withState('counter', 'updateCounter', 0)('div')
    const div = mount(<Counter />).find('div')
    const { updateCounter } = div.props()

    const renderSpy = sinon.spy(() => {
      expect(div.prop('counter')).to.equal(18)
    })

    expect(div.prop('counter')).to.equal(0)
    updateCounter(18, renderSpy)
  })

  it('also accepts initialState as function of props', () => {
    const Counter = withState(
      'counter',
      'updateCounter',
      props => props.initialCounter
    )('div')

    const div = mount(<Counter initialCounter={1} />).find('div')
    const { updateCounter } = div.props()

    expect(div.prop('counter')).to.equal(1)
    updateCounter(n => n * 3)
    expect(div.prop('counter')).to.equal(3)
  })
})
