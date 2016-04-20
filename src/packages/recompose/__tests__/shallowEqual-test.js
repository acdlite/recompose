import test from 'ava'
import { shallowEqual } from '../'

// Adapted from https://github.com/rackt/react-redux/blob/master/test/utils/shallowEqual.spec.js
test('shallowEqual returns true if arguments are equal, without comparing properties', t => {
  const throwOnAccess = {
    get foo() {
      throw new Error('Property was accessed')
    }
  }
  t.true(shallowEqual(throwOnAccess, throwOnAccess))
})

test('shallowEqual returns true if arguments fields are equal', t => {
  t.true(shallowEqual(
    { a: 1, b: 2, c: undefined },
    { a: 1, b: 2, c: undefined }
  ))

  t.true(shallowEqual(
    { a: 1, b: 2, c: 3 },
    { a: 1, b: 2, c: 3 }
  ))

  const o = {}
  t.true(shallowEqual(
    { a: 1, b: 2, c: o },
    { a: 1, b: 2, c: o }
  ))
})

test('shallowEqual returns false if either argument is null or undefined', t => {
  t.false(shallowEqual(null, { a: 1, b: 2 }))
  t.false(shallowEqual({ a: 1, b: 2 }, null))
})

test('shallowEqual returns false if first argument has too many keys', t => {
  t.false(shallowEqual(
    { a: 1, b: 2, c: 3 },
    { a: 1, b: 2 }
  ))
})

test('shallowEqual returns false if second argument has too many keys', t => {
  t.false(shallowEqual(
    { a: 1, b: 2 },
    { a: 1, b: 2, c: 3 }
  ))
})

test('shallowEqual returns false if arguments have different keys', t => {
  t.false(shallowEqual(
    { a: 1, b: 2, c: undefined },
    { a: 1, bb: 2, c: undefined }
  ))
})
