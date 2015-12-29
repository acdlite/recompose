import { expect } from 'chai'
import React from 'react'
import { ArrayObservable } from 'rxjs/observable/fromArray'
import { combineLatest } from 'rxjs/operator/combineLatest'
import { concat } from 'rxjs/operator/concat'
import { scan } from 'rxjs/operator/scan'
import { _do } from 'rxjs/operator/do'
import { map } from 'rxjs/operator/map'
import { toClass, withState, compose, branch } from 'recompose'
import identity from 'lodash/utility/identity'
import createSpy from 'recompose/createSpy'
import { observeProps, createEventHandler } from 'rx-recompose'

const { of } = ArrayObservable

import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
  findRenderedComponentWithType,
  createRenderer
} from 'react-addons-test-utils'

const createSmartButton = BaseComponent =>
  observeProps(props$ => {
    const increment$ = createEventHandler()
    const count$ = of(0)::concat(
      increment$::scan(total => total + 1, 0)
    )

    return props$::combineLatest(count$, (props, count) => ({
      ...props,
      onClick: increment$,
      count
    }))
  }, toClass(BaseComponent))

const Button = toClass(props => <button {...props} />)

describe('observeProps()', () => {
  it('maps a stream of owner props to a stream of child props', () => {
    const SmartButton = createSmartButton(props => <Button {...props} />)
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

  it('works on initial render', () => {
    const SmartButton1 = createSmartButton(props => <Button {...props} />)

    // Test using shallow renderer, which only renders once
    const renderer1 = createRenderer()

    renderer1.render(<SmartButton1 pass="through" />)
    const button1 = renderer1.getRenderOutput()
    expect(button1.props.pass).to.equal('through')
    expect(button1.props.count).to.equal(0)
  })

  it('receives prop updates', () => {
    const spy = createSpy()
    const SmartButton = createSmartButton(spy('div'))

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
        observeProps(() => increment$::_do(() => count += 1)::map(() => ({}))),
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
})
