import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import { partial } from '../'

test('partial with passed values', t => {
  const Component = partial('foo', [1, 'a'])(({ foo }) => (
    <button onClick={foo}>click</button>
  ))

  const foo = sinon.spy()

  const wrapper = mount(<Component {...{ foo }} />)

  wrapper.find('button').simulate('click')

  t.true(foo.calledWith(1, 'a'))
})

test('partial with passed and extra values', t => {
  const Component = partial('foo', [1, 'a'])(({ foo }) => (
    <button onClick={() => foo('b', 3)}>click</button>
  ))

  const foo = sinon.spy()

  const wrapper = mount(<Component {...{ foo }} />)

  wrapper.find('button').simulate('click')

  t.true(foo.calledWith(1, 'a'))
})

test('partial props[functionName] should be a function', t => {
  const Component = partial('foo', [1, 'a'])(({ foo }) => (
    <button onClick={foo}>click</button>
  ))


  const wrapper = mount(<Component foo="asdf" />)

  t.throws(() => wrapper.find('button').simulate('click'))
})
