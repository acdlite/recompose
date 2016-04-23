import test from 'ava'
import assign from 'lodash/assign'
import constant from 'lodash/constant'
import React from 'react'
import createComponent from '../createComponent'

test('createComponent will apply no decorators to base component', t => {
  const Foo = props => <div {...props} />

  t.is(createComponent(Foo), Foo)
})

test('createComponent will apply one decorator to base component', t => {
  const Foo = props => <div {...props} />
  const decorator = Component => assign(Component, { a: 1 })

  t.is(createComponent(decorator, Foo).a, 1)
})

test('createComponent will apply many decorators to base component', t => {
  const Foo = props => <div {...props} />
  const decoratorA = Component => assign(Component, { a: 1 })
  const decoratorB = Component => assign(Component, { b: 2 })
  const createdComponent = createComponent(decoratorA, decoratorB, Foo)

  t.is(createdComponent.a, 1)
  t.is(createdComponent.b, 2)
})

test('createComponent will apply decorators in order', t => {
  const Foo = props => <div {...props} />
  const Bar = props => <div {...props} />
  const Buz = props => <div {...props} />

  t.is(createComponent(constant(Foo), constant(Bar), Buz), Foo)
})
