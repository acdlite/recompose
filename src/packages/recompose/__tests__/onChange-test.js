import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { onChange, withState, compose } from '../'

test('onChange', () => {
  const spy = sinon.spy()

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('name', 'updateName', 'Alexander'),
    onChange('counter', spy)
  )(({ counter }) =>
    <div>
      {counter}
    </div>
  )

  mount(<Counter />)

  sinon.assert.calledWith(spy, {
    counter: 0,
    name: 'Alexander',
    updateName: sinon.match.func,
    updateCounter: sinon.match.func,
  })
  expect(spy.callCount).toBe(1)

  const initProps = spy.lastCall.args[0]
  const { updateCounter, updateName } = initProps

  updateCounter(5)
  expect(spy.secondCall.args[0]).toEqual({ ...initProps, counter: 5 })

  updateName('Andrew')
  expect(spy.callCount).toBe(2)

  updateCounter(10)
  expect(spy.thirdCall.args[0]).toEqual({
    ...initProps,
    name: 'Andrew',
    counter: 10,
  })
})
