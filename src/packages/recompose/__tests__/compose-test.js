import test from 'ava'
import { compose } from '../'

test('compose composes from right to left', t => {
  const double = x => x * 2
  const square = x => x * x
  t.is(compose(square)(5), 25)
  t.is(compose(square, double)(5), 100)
  t.is(compose(double, square, double)(5), 200)
})

test('compose can be seeded with multiple arguments', t => {
  const square = x => x * x
  const add = (x, y) => x + y
  t.is(compose(square, add)(1, 2), 9)
})

test('compose returns the identity function if given no arguments', t => {
  t.is(compose()(1, 2), 1)
  t.is(compose()(3), 3)
  t.is(compose(false,4,'test')(3), 3)
  t.is(compose()(), undefined)
})

test('compose returns the first function if given only one', t => {
  const fn = () => {}
  t.is(compose(fn), fn)
})
