import test from 'ava'
import React from 'react'
import { setDisplayName } from '../'

test('setDisplayName sets a static property on the base component', t => {
  const BaseComponent = () => <div />
  const NewComponent = setDisplayName('Foo')(BaseComponent)
  t.is(NewComponent.displayName, 'Foo')
})
