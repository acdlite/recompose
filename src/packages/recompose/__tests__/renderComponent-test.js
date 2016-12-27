import test from 'ava'
import React from 'react'
import { renderComponent, withState, compose, branch } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('renderComponent always renders the given component', t => {
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

  t.true(componentB.calledOnce)
  t.true(componentA.notCalled)

  updateFlip(true)
  t.true(componentB.calledOnce)
  t.true(componentA.calledOnce)
})
