import React from 'react'
import { expect } from 'chai'
import identity from 'lodash/identity'
import { lifecycle, compose, withState, branch } from 'recompose'
import { mount } from 'enzyme'

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
      )
    )('div')

    const wrapper = mount(<Lifecycle pass="through" />)
    const { updateIsVisible } = wrapper.find('div').props()
    const getCounter = () => wrapper.find('div').prop('counter')
    updateIsVisible(true)
    expect(listeners.length).to.equal(1)

    expect(getCounter()).to.equal(0)
    emit()
    expect(getCounter()).to.equal(1)
    emit()
    expect(getCounter()).to.equal(2)

    updateIsVisible(false)
    expect(listeners.length).to.equal(0)
  })

  it('sets proper display name', () => {
    expect(lifecycle(noop, noop)('div').displayName).to.equal('lifecycle(div)')
  })
})
