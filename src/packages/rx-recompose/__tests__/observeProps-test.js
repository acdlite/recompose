import { expect } from 'chai'
import React from 'react'
import { Observable } from 'rx'
import { toClass, withState, compose, branch } from 'recompose'
import identity from 'lodash/utility/identity'
import createSpy from 'recompose/createSpy'
import { observeProps, createEventHandler } from 'rx-recompose'

import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
  findRenderedComponentWithType,
  createRenderer
} from 'react-addons-test-utils'

const createSmartButton = BaseComponent => (
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
)


const Button = toClass(props => <button {...props} />)

function testSmartButton(element) {
  const tree = renderIntoDocument(element)
  const button = findRenderedComponentWithType(tree, Button)
  const buttonNode = findRenderedDOMComponentWithTag(tree, 'button')

  Simulate.click(buttonNode)
  Simulate.click(buttonNode)
  Simulate.click(buttonNode)

  expect(button.props.count).to.equal(3)
  expect(button.props.pass).to.equal('through')
}

describe('observeProps()', () => {
  it('maps a stream of owner props to a stream of child props', () => {
    const SmartButton = createSmartButton(props => <Button {...props} />)
    expect(SmartButton.displayName).to.equal('observeProps(Component)')
    testSmartButton(<SmartButton pass="through" />)
  })

  it('works on initial render', () => {
    const SmartButton = createSmartButton(props => <Button {...props} />)

    // Test using shallow renderer, which only renders once
    const renderer = createRenderer()
    renderer.render(<SmartButton pass="through" />)
    const button = renderer.getRenderOutput()
    expect(button.props.pass).to.equal('through')
    expect(button.props.count).to.equal(0)
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
})
