import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import { partialWithProps } from '../'

test('partialWithProps with passed props', t => {
  const Component = partialWithProps('foo', ['firstProp', 'secondProp'])(
    ({ foo }) => <button onClick={foo}>click</button>
  )

  const foo = sinon.spy()

  const wrapper = mount(<Component foo={foo} firstProp={1} secondProp="asd" />)

  wrapper.find('button').simulate('click')

  t.true(
    foo.calledWith(1, 'asd')
  )
})

test('partialWithProps with passes props and extra args', t => {
  const Component = partialWithProps('foo', ['firstProp', 'secondProp'])(
    ({ foo }) => <button onClick={() => foo('qwe', {})}>click</button>
  )

  const foo = sinon.spy()

  const wrapper = mount(<Component foo={foo} firstProp={1} secondProp="asd" />)

  wrapper.find('button').simulate('click')

  t.true(
    foo.calledWith(1, 'asd', 'qwe', {})
  )
})

test('partialWithPrpos props[funcName] should be a function', t => {
  const Component = partialWithProps('foo', ['firstProp', 'secondProp'])(
    ({ foo }) => <button onClick={foo}>click</button>
  )

  const wrapper = mount(<Component foo={1} firstProp={3} secondProp="asd" />)

  t.throws(() => wrapper.find('button').simulate('click'))
})
