import { expect } from 'chai'
import createHelper from '../createHelper'

describe('createHelper()', () => {
  it('properly sets display name', () => {
    const BaseComponent = { displayName: 'Base' }

    const func = () => _ => ({})

    expect(
      createHelper(func, 'func')()(BaseComponent).displayName
    ).to.equal('func(Base)')

    expect(
      createHelper(func, 'func', false)()(BaseComponent).displayName
    ).to.be.undefined
  })

  it('works for zero-arg helpers', () => {
    const BaseComponent = { displayName: 'Base' }
    const func = _ => ({})

    expect(
      createHelper(func, 'func', true, true)(BaseComponent).displayName
    ).to.equal('func(Base)')

    expect(
      createHelper(func, 'func', false, true)(BaseComponent).displayName
    ).to.be.undefined
  })
})
