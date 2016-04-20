import test from 'ava'
import createHelper from '../createHelper'
import sinon from 'sinon'

test('createHelper properly sets display name', t => {
  const BaseComponent = { displayName: 'Base' }
  const func = () => _ => ({})

  t.is(
    createHelper(func, 'func')()(BaseComponent).displayName,
    'func(Base)'
  )

  t.is(
    createHelper(func, 'func', false)()(BaseComponent).displayName,
    undefined
  )
})

test('createHelper works for zero-arg helpers', t => {
  const BaseComponent = { displayName: 'Base' }
  const func = _ => ({})

  t.is(
    createHelper(func, 'func', true, true)(BaseComponent).displayName,
    'func(Base)'
  )

  t.is(
    createHelper(func, 'func', false, true)(BaseComponent).displayName,
    undefined
  )
})

test.serial('createHelper warns if too many arguments are passed to a helper', t => {
  const error = sinon.stub(console, 'error')
  const func = (a, b, c) => ({ a, b, c })
  const helper = createHelper(func, 'func')
  helper(1, 2, 3)
  t.false(error.called)

  helper(1, 2, 3, 4)
  t.is(
    error.firstCall.args[0],
    'Too many arguments passed to func(). It should called like so: ' +
    'func(...args)(BaseComponent).'
  )

  /* eslint-disable */
  console.error.restore()
  /* eslint-enable */
})
