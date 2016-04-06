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

  it('warns if too many arguments are passed to a helper', () => {
    const error = sinon.stub(console, 'error')
    const func = (a, b, c) => ({ a, b, c })
    const helper = createHelper(func, 'func')
    helper(1, 2, 3)
    expect(error.called).to.be.false

    helper(1, 2, 3, 4)
    expect(error.firstCall.args[0]).to.equal(
      'Too many arguments passed to func(). It should called like so: ' +
      'func(...args)(BaseComponent).'
    )

    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })
})
