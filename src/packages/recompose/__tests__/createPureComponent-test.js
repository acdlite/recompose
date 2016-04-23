import test from 'ava'
import assign from 'lodash/assign'
import constant from 'lodash/constant'
import React from 'react'
import createPureComponent from '../createPureComponent'

test('createPureComponent decorates base component with `pure`', t => {
  const Foo = props => <div {...props} />
  const createdComponent = createPureComponent(Foo)

  t.is(typeof createdComponent.prototype.isReactComponent, 'object')
  t.truthy(createdComponent.prototype.shouldComponentUpdate)
})

test('createPureComponent decorates base component after other decorators', t => {
  const Foo = props => <div {...props} />
  const Bar = props => <div {...props} />

  t.notEqual(createPureComponent(constant(Bar), Foo), Bar)
})

test('createPureComponent retains static properties', t => {
  const Foo = props => <div {...props} />
  const decorator = Component => assign(Component, { a: 1 })

  t.is(createPureComponent(decorator, Foo).a, 1)
})
