import createHelper from '../createHelper'

test('createHelper properly sets display name', () => {
  const BaseComponent = { displayName: 'Base' }
  const func = () => _ => ({})

  expect(createHelper(func, 'func')()(BaseComponent).displayName).toBe('func(Base)')

  expect(createHelper(func, 'func', false)()(BaseComponent).displayName).toBe(undefined)
})

test('createHelper works for zero-arg helpers', () => {
  const BaseComponent = { displayName: 'Base' }
  const func = _ => ({})

  expect(createHelper(func, 'func', true, true)(BaseComponent).displayName).toBe('func(Base)')

  expect(createHelper(func, 'func', false, true)(BaseComponent).displayName).toBe(undefined)
})
