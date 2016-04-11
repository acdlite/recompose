import React from 'react'
import { expect } from 'chai'
import { doOnReceiveProps, compose, withState, mapProps } from 'recompose'
import { mount } from 'enzyme'

describe('doOnReceiveProps()', () => {
  it('fires a callback when receiving new props', () => {
    const spy = sinon.spy()
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      mapProps(({ updateCounter, ...rest }) => ({
        increment: () => updateCounter(n => n + 1),
        ...rest
      })),
      doOnReceiveProps(spy)
    )('div')

    expect(Counter.displayName).to.equal(
      'withState(mapProps(doOnReceiveProps(div)))'
    )

    const div = mount(<Counter />).find('div')
    const { increment } = div.props()
    const getCounter = () => spy.lastCall.args[0].counter

    expect(getCounter()).to.equal(0)
    increment()
    expect(getCounter()).to.equal(1)
    increment()
    expect(getCounter()).to.equal(2)
  })
})
