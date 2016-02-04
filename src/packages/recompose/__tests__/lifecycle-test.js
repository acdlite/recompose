import React from 'react'
import { expect } from 'chai'
import identity from 'lodash/identity'
import { lifecycle, compose, withState, branch } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

const noop = () => {}

describe('lifecycle()', () => {
  it('gives access to the component instance on setup and teardown', () => {
    let listeners = []

    const subscribe = listener => {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    }

    const emit = () => {
      listeners.forEach(l => l())
    }

    const spy = createSpy()

    const Lifecycle = compose(
      withState('isVisible', 'updateIsVisible', false),
      branch(
        props => props.isVisible,
        lifecycle(
          component => {
            component.state = { counter: 0 }
            component.dispose = subscribe(() => (
              component.setState(state => ({ counter: state.counter + 1 }))
            ))
          },
          component => {
            component.dispose()
          }
        ),
        identity
      ),
      spy
    )('div')

    renderIntoDocument(<Lifecycle pass="through" />)

    spy.getProps().updateIsVisible(true)
    expect(listeners.length).to.equal(1)

    expect(spy.getProps().counter).to.equal(0)
    emit()
    expect(spy.getProps().counter).to.equal(1)
    emit()
    expect(spy.getProps().counter).to.equal(2)

    spy.getProps().updateIsVisible(false)
    expect(listeners.length).to.equal(0)
  })

  it('sets proper display name', () => {
    expect(lifecycle(noop, noop, 'div').displayName).to.equal('lifecycle(div)')
  })
})
