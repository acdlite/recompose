import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { withPropChangeHandler } from '../'

test('withPropChangeHandler sets the proper displayName', () => {
  const component = () => null
  component.displayName = 'component'

  const ComponentWithPropChangeHandler = withPropChangeHandler(() => null)(
    component
  )

  expect(ComponentWithPropChangeHandler.displayName).toBe(
    'withPropChangeHandler(component)'
  )
})

test('withPropChangeHandler renders the base component', () => {
  const component = sinon.spy(() => null)

  const SpyWithPropChangeHandler = withPropChangeHandler(
    ['a', 'b'],
    () => null
  )(component)

  const wrapper = mount(<SpyWithPropChangeHandler a={1} b={1} />)
  wrapper.setProps({ b: undefined })
  wrapper.setProps({ c: 1 })
  expect(component.args[0][0]).toEqual({ a: 1, b: 1 })
  expect(component.args[1][0]).toEqual({ a: 1 })
  expect(component.args[2][0]).toEqual({ a: 1, c: 1 })
  wrapper.unmount()
})

test('withPropChangeHandler calls propChangeHandler on every change if keys argument is null', () => {
  const component = sinon.spy(() => null)

  const propChangeHandler = sinon.spy()

  const SpyWithPropChangeHandler = withPropChangeHandler(
    null,
    propChangeHandler
  )(component)

  expect(propChangeHandler.callCount).toBe(0)

  const wrapper = mount(<SpyWithPropChangeHandler a={1} b={1} />)

  expect(propChangeHandler.callCount).toBe(1)
  expect(propChangeHandler.args[0]).toEqual([{ a: 1, b: 1 }, {}])

  wrapper.setProps({ b: undefined })

  expect(propChangeHandler.callCount).toBe(2)
  expect(propChangeHandler.args[1]).toEqual([{ a: 1 }, { a: 1, b: 1 }])

  wrapper.setProps({ c: 1 })

  expect(propChangeHandler.callCount).toBe(3)
  expect(propChangeHandler.args[2]).toEqual([{ a: 1, c: 1 }, { a: 1 }])

  wrapper.setProps({ c: 1 })

  expect(propChangeHandler.callCount).toBe(3)

  wrapper.unmount()

  expect(propChangeHandler.callCount).toBe(4)
  expect(propChangeHandler.args[3]).toEqual([{}, { a: 1, c: 1 }])
})

test('withPropChangeHandler calls propChangeHandler only when the specified props change', () => {
  const component = sinon.spy(() => null)

  const propChangeHandler = sinon.spy()

  const SpyWithPropChangeHandler = withPropChangeHandler(
    ['a', 'b'],
    propChangeHandler
  )(component)

  expect(propChangeHandler.callCount).toBe(0)

  const wrapper = mount(<SpyWithPropChangeHandler a={1} b={1} />)

  expect(propChangeHandler.callCount).toBe(1)
  expect(propChangeHandler.args[0]).toEqual([{ a: 1, b: 1 }, {}])

  wrapper.setProps({ b: 2 })

  expect(propChangeHandler.callCount).toBe(2)
  expect(propChangeHandler.args[1]).toEqual([{ a: 1, b: 2 }, { a: 1, b: 1 }])

  wrapper.setProps({ a: 3, b: 3 })

  expect(propChangeHandler.callCount).toBe(3)
  expect(propChangeHandler.args[2]).toEqual([{ a: 3, b: 3 }, { a: 1, b: 2 }])

  wrapper.setProps({ a: 3 })

  expect(propChangeHandler.callCount).toBe(3)

  wrapper.setProps({ c: 1, d: 1 })

  expect(propChangeHandler.callCount).toBe(3)

  wrapper.setProps({ d: undefined })

  expect(propChangeHandler.callCount).toBe(3)

  wrapper.setProps({ b: undefined })

  expect(propChangeHandler.callCount).toBe(4)
  expect(propChangeHandler.args[3]).toEqual([
    { a: 3, c: 1 },
    { a: 3, b: 3, c: 1 },
  ])

  wrapper.setProps({ b: 3 })

  expect(propChangeHandler.callCount).toBe(5)
  expect(propChangeHandler.args[4]).toEqual([
    { a: 3, b: 3, c: 1 },
    { a: 3, c: 1 },
  ])

  wrapper.unmount()

  expect(propChangeHandler.callCount).toBe(6)
  expect(propChangeHandler.args[5]).toEqual([{}, { a: 3, b: 3, c: 1 }])
})
