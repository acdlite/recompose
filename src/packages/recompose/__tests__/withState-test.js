import React from 'react'
import { withState } from '../'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'

test('withState adds a stateful value and a function for updating it', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  expect(Counter.displayName).toBe('withState(component)')

  mount(<Counter pass="through" />)
  const { updateCounter } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].pass).toBe('through')

  updateCounter(n => n + 9)
  updateCounter(n => n * 2)

  expect(component.lastCall.args[0].counter).toBe(18)
  expect(component.lastCall.args[0].pass).toBe('through')
})

test('withState also accepts a non-function, which is passed directly to setState()', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  mount(<Counter />)
  const { updateCounter } = component.firstCall.args[0]

  updateCounter(18)
  expect(component.lastCall.args[0].counter).toBe(18)
})

test('withState accepts setState() callback', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState('counter', 'updateCounter', 0)(component)
  mount(<Counter />)
  const { updateCounter } = component.firstCall.args[0]

  const renderSpy = sinon.spy(() => {
    expect(component.lastCall.args[0].counter).toBe(18)
  })

  expect(component.lastCall.args[0].counter).toBe(0)
  updateCounter(18, renderSpy)
})

test('withState also accepts initialState as function of props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withState(
    'counter',
    'updateCounter',
    props => props.initialCounter
  )(component)

  mount(<Counter initialCounter={1} />)
  const { updateCounter } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(1)
  updateCounter(n => n * 3)
  expect(component.lastCall.args[0].counter).toBe(3)
})

test('withState (1 param) adds state and setState props', () => {
  const enhance = withState({ clicked: 'no' })
  const Component = enhance(({ state, setState }) =>
    <button
      onClick={() => setState({ clicked: 'yes' })}
    >
      {state.clicked}{state.foo}
    </button>
  )

  const wrapper = shallow(<Component />)

  expect(wrapper.text()).toBe('no')
  wrapper.find('button').simulate('click')
  expect(wrapper.text()).toBe('yes')
})

test('withState (1 param) allows modify and merge in same update', () => {
  const enhance = withState({ foo: 'empty' })
  const Component = enhance(({ state, setState }) =>
    <button
      onClick={() => setState({ foo: 'foo', bar: 'bar' })}
    >
      {state.foo}{state.bar}
    </button>
  )

  const wrapper = shallow(<Component />)

  expect(wrapper.text()).toBe('empty')
  wrapper.find('button').simulate('click')
  expect(wrapper.text()).toBe('foobar')
})

test('withState (1 param) accepts setState() callback', () => {
  const enhance = withState({ foo: 'foo' })
  const callback = jest.fn()
  const Component = enhance(({ setState }) =>
    <button
      onClick={() => setState({ foo: 'bar' }, callback)}
    />
  )

  const wrapper = shallow(<Component />)

  wrapper.find('button').simulate('click')
  expect(callback).toHaveBeenCalled()
})

test('withState (1 param) accepts initialState as function of props', () => {
  const enhance = withState(({ initialText }) => ({ text: initialText }))
  const Component = enhance(({ state, setState }) =>
    <button
      onClick={() => setState({ text: 'new text' })}
    >
      {state.text}
    </button>
  )

  const wrapper = shallow(<Component initialText="old text" />)

  expect(wrapper.text()).toBe('old text')
  wrapper.find('button').simulate('click')
  expect(wrapper.text()).toBe('new text')
})
