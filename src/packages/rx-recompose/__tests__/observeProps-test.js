import { expect } from 'chai'
import React from 'react'
import { Observable, Subject } from 'rx'
import { toClass, withState, compose, branch } from 'recompose'
import identity from 'lodash/identity'
import createSpy from 'recompose/createSpy'
import { observeProps, createEventHandler } from 'rx-recompose'

import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
  findRenderedComponentWithType,
  createRenderer
} from 'react-addons-test-utils'

const createSmartButton1 = BaseComponent =>
  observeProps(props$ => {
    const increment$ = createEventHandler()
    const count$ = increment$
      .startWith(0)
      .scan(total => total + 1)

    return Observable.combineLatest(props$, count$, (props, count) => ({
      ...props,
      onClick: increment$,
      count
    }))
  }, toClass(BaseComponent))

const createSmartButton2 = BaseComponent =>
  observeProps(() => {
    const increment$ = createEventHandler()
    const count$ = increment$
      .startWith(0)
      .scan(total => total + 1)

    return {
      onClick: Observable.just(increment$),
      count: count$
    }
  }, toClass(BaseComponent))

const Button = toClass(props => <button {...props} />)

describe('observeProps()', () => {
  it('maps a stream of owner props to a stream of child props', () => {
    const SmartButton = createSmartButton1(props => <Button {...props} />)
    expect(SmartButton.displayName).to.equal('observeProps(Component)')

    const tree = renderIntoDocument(<SmartButton pass="through" />)
    const button = findRenderedComponentWithType(tree, Button)
    const buttonNode = findRenderedDOMComponentWithTag(tree, 'button')

    Simulate.click(buttonNode)
    Simulate.click(buttonNode)
    Simulate.click(buttonNode)

    expect(button.props.count).to.equal(3)
    expect(button.props.pass).to.equal('through')
  })

  it('maps a stream of owner props to an object of child prop streams', () => {
    const SmartButton = createSmartButton2(props => <Button {...props} />)
    expect(SmartButton.displayName).to.equal('observeProps(Component)')

    const tree = renderIntoDocument(<SmartButton pass="through" />)
    const button = findRenderedComponentWithType(tree, Button)
    const buttonNode = findRenderedDOMComponentWithTag(tree, 'button')

    Simulate.click(buttonNode)
    Simulate.click(buttonNode)
    Simulate.click(buttonNode)

    expect(button.props.count).to.equal(3)
    expect(button.props.pass).to.be.undefined
  })

  it('works on initial render', () => {
    const SmartButton1 = createSmartButton1(props => <Button {...props} />)
    const SmartButton2 = createSmartButton2(props => <Button {...props} />)

    // Test using shallow renderer, which only renders once
    const renderer1 = createRenderer()

    renderer1.render(<SmartButton1 pass="through" />)
    const button1 = renderer1.getRenderOutput()
    expect(button1.props.pass).to.equal('through')
    expect(button1.props.count).to.equal(0)


    const renderer2 = createRenderer()

    renderer2.render(<SmartButton2 pass="through" />)
    const button2 = renderer2.getRenderOutput()
    expect(button2.props.pass).to.be.undefined
    expect(button2.props.count).to.equal(0)
  })

  it('receives prop updates', () => {
    const spy = createSpy()
    const SmartButton = createSmartButton1(spy('div'))

    const Container = withState('label', 'updateLabel', 'Count', SmartButton)

    renderIntoDocument(<Container />)

    expect(spy.getProps().label).to.equal('Count')
    spy.getProps().updateLabel('Current count')
    expect(spy.getProps().label).to.equal('Current count')
  })

  it('unsubscribes before unmounting', () => {
    const spy = createSpy()
    const increment$ = createEventHandler()
    let count = 0

    const Container = compose(
      withState('observe', 'updateObserve', false),
      spy,
      branch(
        props => props.observe,
        observeProps(() => increment$.do(() => count += 1).map(() => ({}))),
        identity
      )
    )('div')

    renderIntoDocument(<Container />)

    const { updateObserve } = spy.getProps()
    expect(count).to.equal(0)
    updateObserve(true) // Mount component
    increment$()
    expect(count).to.equal(1)
    increment$()
    expect(count).to.equal(2)
    updateObserve(false) // Unmount component
    increment$()
    expect(count).to.equal(2)
  })

  it('renders null until stream of props emits value', () => {
    const props$ = new Subject()
    const spy = createSpy()
    const Container = compose(
      observeProps(() => props$),
      spy
    )('div')

    renderIntoDocument(<Container />)

    expect(spy.getInfo().length).to.equal(0)
    props$.onNext({})
    expect(spy.getRenderCount()).to.equal(1)
  })
})
