import test from 'ava'
import React from 'react'
import { Observable, Subject } from 'rx'
import { withState, compose, branch } from 'recompose'
import identity from 'lodash/identity'
import { observeProps, createEventHandler } from '../'
import { mount, shallow } from 'enzyme'

test('maps a stream of owner props to a stream of child props', t => {
  const SmartButton = observeProps(props$ => {
    const increment$ = createEventHandler()
    const count$ = increment$
      .startWith(0)
      .scan(total => total + 1)

    return Observable.combineLatest(props$, count$, (props, count) => ({
      ...props,
      onClick: increment$,
      count
    }))
  })('button')

  t.is(SmartButton.displayName, 'observeProps(button)')

  const button = mount(<SmartButton pass="through" />).find('button')

  button.simulate('click')
  button.simulate('click')
  button.simulate('click')

  t.is(button.prop('count'), 3)
  t.is(button.prop('pass'), 'through')
})

test('works on initial render', t => {
  const SmartButton = observeProps(props$ => {
    const increment$ = createEventHandler()
    const count$ = increment$
      .startWith(0)
      .scan(total => total + 1)

    return Observable.combineLatest(props$, count$, (props, count) => ({
      ...props,
      onClick: increment$,
      count
    }))
  })('button')

  const button = shallow(<SmartButton pass="through" />).find('button')

  t.is(button.prop('count'), 0)
  t.is(button.prop('pass'), 'through')
})

test('receives prop updates', t => {
  const SmartButton = observeProps(props$ => {
    const increment$ = createEventHandler()
    const count$ = increment$
      .startWith(0)
      .scan(total => total + 1)

    return Observable.combineLatest(props$, count$, (props, count) => ({
      ...props,
      onClick: increment$,
      count
    }))
  })('button')

  const Container = withState('label', 'updateLabel', 'Count')(SmartButton)

  const button = mount(<Container />).find('button')
  const { updateLabel } = button.props()

  t.is(button.prop('label'), 'Count')
  updateLabel('Current count')
  t.is(button.prop('label'), 'Current count')
})

test('unsubscribes before unmounting', t => {
  const increment$ = createEventHandler()
  let count = 0

  const Container = compose(
    withState('observe', 'updateObserve', false),
    branch(
      props => props.observe,
      observeProps(() =>
        increment$
          .do(() => count += 1)
          .map(() => ({}))
      ),
      identity
    )
  )('div')

  const div = mount(<Container />).find('div')
  const { updateObserve } = div.props()

  t.is(count, 0)
  updateObserve(true) // Mount component
  increment$()
  t.is(count, 1)
  increment$()
  t.is(count, 2)
  updateObserve(false) // Unmount component
  increment$()
  t.is(count, 2)
})

test('renders null until stream of props emits value', t => {
  const props$ = new Subject()
  const Container = observeProps(() => props$)('div')
  const wrapper = mount(<Container />)

  t.false(wrapper.some('div'))
  props$.onNext({ foo: 'bar' })
  t.is(wrapper.find('div').prop('foo'), 'bar')
})
