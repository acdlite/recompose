import React from 'react'
import { expect } from 'chai'
import omit from 'lodash/object/omit'
import pick from 'lodash/object/pick'
import { withState, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('withState()', () => {
  const spy = createSpy()
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    spy
  )('div')

  const savedConsoleError = console.error // eslint-disable-line

  beforeEach(() => {
    console.error = (message) => {  // eslint-disable-line
      throw new Error(message)
    }
  })

  afterEach(() => {
    console.error = savedConsoleError  // eslint-disable-line
  })

  it('adds a stateful value and a function for updating it', () => {
    expect(Counter.displayName).to.equal(
      'withState(spy(div))'
    )

    renderIntoDocument(<Counter pass="through" />)

    expect(omit(spy.getProps(), 'updateCounter')).to.eql({
      counter: 0,
      pass: 'through'
    })

    spy.getProps().updateCounter(n => n + 9)
    spy.getProps().updateCounter(n => n * 2)
    expect(omit(spy.getProps(), 'updateCounter')).to.eql({
      counter: 18,
      pass: 'through'
    })
  })

  it('also accepts a non-function, which is passed directly to setState()', () => {
    renderIntoDocument(<Counter pass="through" />)

    spy.getProps().updateCounter(18)
    expect(omit(spy.getProps(), 'updateCounter')).to.eql({
      counter: 18,
      pass: 'through'
    })
  })

  it('accepts setState() callback', () => {
    const Counter2 = compose(
      withState('counter', 'updateCounter', 0),
      spy
    )('div')

    renderIntoDocument(<Counter2 pass="through" />)
    const renderSpy = sinon.spy(() => {
      expect(spy.getRenderCount()).to.equal(2)
    })

    expect(spy.getRenderCount()).to.equal(1)
    spy.getProps().updateCounter(18, renderSpy)
    expect(renderSpy.callCount).to.eql(1)
  })

  it('also accepts initialState as function of props', () => {
    const spy2 = createSpy()
    const Counter3 = compose(
      withState('counter', 'updateCounter', props => props.initialCounter),
      spy2
    )('div')

    renderIntoDocument(<Counter3 initialCounter={1} />)

    expect(spy2.getProps().counter).to.equal(1)
    spy2.getProps().updateCounter(n => n * 3)
    expect(spy2.getProps().counter).to.equal(3)
  })

  it('does not call setState after component unmount', () => {

    const spy4 = createSpy()
    const Counter4 = compose(
      withState('counter', 'updateCounter', 0),
      spy4
    )('div')

    const unmounterSpy = createSpy()
    const Unmounter = compose(
      withState('isMounted', 'setIsMounted', true),
      unmounterSpy
    )((props) => props.isMounted ? <Counter4/> : <div/>)

    renderIntoDocument(<Unmounter />)

    spy4.getProps().updateCounter(100)
    expect(pick(spy4.getProps(), 'counter')).to.eql({
      counter: 100,
    })

    const props = spy4.getProps()

    unmounterSpy.getProps().setIsMounted(false)
    expect(pick(unmounterSpy.getProps(), 'isMounted')).to.eql({
      isMounted: false,
    })

    props.updateCounter(200)
  })
})
