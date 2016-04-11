import { expect } from 'chai'
import { renderNothing } from 'recompose'

describe('renderNothing()', () => {
  it('returns a component that renders null', () => {
    const nothing = renderNothing('div')
    expect(nothing()).to.be.null
    expect(nothing.displayName).to.equal('Nothing')
  })
})
