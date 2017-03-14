import test from 'ava'
import pick from '../utils/pick'

test('picks keys from object', t => {
  const obj = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  }

  const picked = pick(obj, ['foo', 'bar'])

  t.deepEqual(picked, {
    foo: 'foo',
    bar: 'bar'
  })
})

test('picks deep keys from object', t => {
  const obj = {
    foo: {
      foo: { foo: 'foo' },
      bar: 'bar'
    },
    baz: {
      baz: 'baz',
      quux: 'quux'
    }
  }

  const picked = pick(obj, ['foo.foo.foo', 'baz.baz'])

  t.deepEqual(picked, {
    'foo.foo.foo': 'foo',
    'baz.baz': 'baz'
  })
})

test('picks undefined deep keys from object', t => {
  const obj = {
    foo: {
      foo: undefined,
      bar: 'bar'
    }
  }

  const picked = pick(obj, ['foo.foo.foo'])

  t.deepEqual(picked, {
    'foo.foo.foo': undefined
  })
})

test('picks non-existent deep keys from object', t => {
  const obj = {
    foo: {
      foo: 'foo',
      bar: 'bar'
    }
  }

  const picked = pick(obj, ['foo.baz'])

  t.deepEqual(picked, {
    'foo.baz': undefined
  })
})
