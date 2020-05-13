import { shallowEqual } from '../'

// Adapted from https://github.com/rackt/react-redux/blob/master/test/utils/shallowEqual.spec.js
test('shallowEqual returns true if arguments are equal, without comparing properties', () => {
  const throwOnAccess = {
    get foo() {
      throw new Error('Property was accessed')
    },
  }
  expect(shallowEqual(throwOnAccess, throwOnAccess)).toBe(true)
})

test('shallowEqual returns true if arguments fields are equal', () => {
  expect(
    shallowEqual({ a: 1, b: 2, c: undefined }, { a: 1, b: 2, c: undefined })
  ).toBe(true)

  expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true)

  const o = {}
  expect(shallowEqual({ a: 1, b: 2, c: o }, { a: 1, b: 2, c: o })).toBe(true)
})

test('shallowEqual returns false if either argument is null or undefined', () => {
  expect(shallowEqual(null, { a: 1, b: 2 })).toBe(false)
  expect(shallowEqual({ a: 1, b: 2 }, null)).toBe(false)
})

test('shallowEqual returns false if first argument has too many keys', () => {
  expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBe(false)
})

test('shallowEqual returns false if second argument has too many keys', () => {
  expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBe(false)
})

test('shallowEqual returns false if arguments have different keys', () => {
  expect(
    shallowEqual({ a: 1, b: 2, c: undefined }, { a: 1, bb: 2, c: undefined })
  ).toBe(false)
})
