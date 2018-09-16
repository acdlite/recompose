import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import { compose, withStateUpdaters } from '..'

test('withStateUpdaters can persist events passed as argument', () => {
  const component = ({ value, onChange }) =>
    <div>
      <input type="text" value={value} onChange={onChange} />
      <p>
        {value}
      </p>
    </div>

  const InputComponent = withStateUpdaters(
    { value: '' },
    {
      onChange: e => {
        e.persist()
        return () => ({
          value: e.target.value,
        })
      },
    }
  )(component)

  const wrapper = mount(<InputComponent />)
  const input = wrapper.find('input')
  const output = wrapper.find('p')
  // having that enzyme simulate does not simulate real situation
  // emulate persist
  input.simulate('change', {
    persist() {
      this.target = { value: 'Yay' }
    },
  })
  expect(output.text()).toBe('Yay')

  input.simulate('change', { target: { value: 'empty' } })
  expect(output.text()).toBe('empty')
})

test('withStateUpdaters can save values from events passed as argument', () => {
  const component = ({ value, onChange }) =>
    <div>
      <input type="text" value={value} onChange={onChange} />
      <p>
        {value}
      </p>
    </div>

  const InputComponent = withStateUpdaters(
    { value: '' },
    {
      onChange: e => {
        const value = e.target.value
        return () => ({
          value,
        })
      },
    }
  )(component)

  const wrapper = mount(<InputComponent />)
  const input = wrapper.find('input')
  const output = wrapper.find('p')
  // having that enzyme simulate does not simulate real situation
  // emulate persist
  const e = {
    target: { value: 'Yay' },
  }
  input.simulate('change', e)
  expect(output.text()).toBe('Yay')

  e.target.value = 'empty'
  input.simulate('change', e)
  expect(output.text()).toBe('empty')
})

test('withStateUpdaters adds a stateful value and a function for updating it', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(
    { counter: 0 },
    {
      updateCounter: increment => ({ counter }) => ({
        counter: counter + increment,
      }),
    }
  )(component)
  expect(Counter.displayName).toBe('withStateUpdaters(component)')

  mount(<Counter pass="through" />)
  const { updateCounter } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].pass).toBe('through')

  updateCounter(9)
  expect(component.lastCall.args[0].counter).toBe(9)
  updateCounter(1)
  updateCounter(10)

  expect(component.lastCall.args[0].counter).toBe(20)
  expect(component.lastCall.args[0].pass).toBe('through')
})

test('withStateUpdaters accepts initialState as function of props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      updateCounter: increment => ({ counter }) => ({
        counter: counter + increment,
      }),
    }
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)
  expect(component.lastCall.args[0].counter).toBe(initialCounter)
})

test('withStateUpdaters initial state must be function or object or null or undefined', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(1, {})(component)
  // React throws an error
  // expect(() => mount(<Counter />)).toThrow()
  const error = sinon.stub(console, 'error')
  mount(<Counter />)
  expect(error.called).toBe(true)
})

test('withStateUpdaters has access to props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      increment: () => ({ counter }, { incrementValue }) => ({
        counter: counter + incrementValue,
      }),
    }
  )(component)

  const initialCounter = 101
  const incrementValue = 37

  mount(
    <Counter initialCounter={initialCounter} incrementValue={incrementValue} />
  )

  const { increment } = component.firstCall.args[0]

  increment()
  expect(component.lastCall.args[0].counter).toBe(
    initialCounter + incrementValue
  )
})

test('withStateUpdaters passes immutable state updaters', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      increment: () => ({ counter }, { incrementValue }) => ({
        counter: counter + incrementValue,
      }),
    }
  )(component)

  const initialCounter = 101
  const incrementValue = 37

  mount(
    <Counter initialCounter={initialCounter} incrementValue={incrementValue} />
  )

  const { increment } = component.firstCall.args[0]

  increment()
  expect(component.lastCall.args[0].counter).toBe(
    initialCounter + incrementValue
  )
})

test('withStateUpdaters does not rerender if inner state updater returns undefined', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      updateCounter: increment => ({ counter }) =>
        increment === 0
          ? undefined
          : {
              counter: counter + increment,
            },
    }
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)
  expect(component.callCount).toBe(1)

  const { updateCounter } = component.firstCall.args[0]

  updateCounter(1)
  expect(component.callCount).toBe(2)

  updateCounter(0)
  expect(component.callCount).toBe(2)
})

test('withStateUpdaters does not rerender if state updater returns undefined', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateUpdaters(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      updateCounter: increment =>
        increment === 0
          ? undefined
          : {
              counter: increment,
            },
    }
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)
  expect(component.callCount).toBe(1)

  const { updateCounter } = component.firstCall.args[0]

  updateCounter(1)
  expect(component.callCount).toBe(2)

  updateCounter(0)
  expect(component.callCount).toBe(2)
})

test('withStateUpdaters rerenders if parent props changed', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withStateUpdaters(
      ({ initialCounter }) => ({
        counter: initialCounter,
      }),
      {
        increment: incrementValue => ({ counter }) => ({
          counter: counter + incrementValue,
        }),
      }
    ),
    withStateUpdaters(
      { incrementValue: 1 },
      {
        // updates parent state and return undefined
        updateParentIncrement: () => ({ incrementValue }, { increment }) => {
          increment(incrementValue)
          return undefined
        },
      }
    )
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)

  const { updateParentIncrement } = component.firstCall.args[0]

  updateParentIncrement()
  expect(component.lastCall.args[0].counter).toBe(initialCounter + 1)
})
