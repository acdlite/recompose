import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { renderComponent, withState, compose, branch } from '../'

test('renderComponent always renders the given component', () => {
  const componentA = sinon.spy(() => null)
  const componentB = sinon.spy(() => null)

  const Foobar = compose(
    withState('flip', 'updateFlip', false),
    branch(
      props => props.flip,
      renderComponent(componentA),
      renderComponent(componentB)
    )
  )(null)

  mount(<Foobar />)
  const { updateFlip } = componentB.firstCall.args[0]

  expect(componentB.calledOnce).toBe(true)
  expect(componentA.notCalled).toBe(true)

  updateFlip(true)
  expect(componentB.calledOnce).toBe(true)
  expect(componentA.calledOnce).toBe(true)
})
