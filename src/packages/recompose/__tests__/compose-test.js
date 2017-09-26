import { compose } from '../'

test('compose composes from right to left', () => {
  const double = x => x * 2
  const square = x => x * x
  expect(compose(square)(5)).toBe(25)
  expect(compose(square, double)(5)).toBe(100)
  expect(compose(double, square, double)(5)).toBe(200)
})

test('compose can be seeded with multiple arguments', () => {
  const square = x => x * x
  const add = (x, y) => x + y
  expect(compose(square, add)(1, 2)).toBe(9)
})

test('compose returns the identity function if given no arguments', () => {
  expect(compose()(1, 2)).toBe(1)
  expect(compose()(3)).toBe(3)
  expect(compose()()).toBe(undefined)
})

test('compose returns the first function if given only one', () => {
  const square = x => x * x
  const plus = (a, b) => a + b
  expect(compose(plus)(5, 6)).toBe(11)
  expect(compose(square)(9)).toBe(81)
})
