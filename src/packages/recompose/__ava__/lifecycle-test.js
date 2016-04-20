import test from 'ava'
import React from 'react'
import identity from 'lodash/identity'
import { lifecycle, compose, withState, branch } from '../'
import { mount } from 'enzyme'

const noop = () => {}

test('lifecycle gives access to the component instance on setup and teardown', t => {
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
  t.is(listeners.length, 1)

  t.is(getCounter(), 0)
  emit()
  t.is(getCounter(), 1)
  emit()
  t.is(getCounter(), 2)

  updateIsVisible(false)
  t.is(listeners.length, 0)
})

test('lifecycle sets proper display name', t => {
  t.is(lifecycle(noop, noop)('div').displayName, 'lifecycle(div)')
})
