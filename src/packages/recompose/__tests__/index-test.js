import test from 'ava'
import React from 'react'
import Rc, { mapProps } from '../'

test('export the root object and individual functions', t => {
  t.is(typeof Rc, 'object')
  t.is(typeof Rc.mapProps, 'function')
  t.is(typeof mapProps, 'function')
  t.is(mapProps, Rc.mapProps)
})
