import test from 'ava'
import createHelper from '../createHelper'

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
