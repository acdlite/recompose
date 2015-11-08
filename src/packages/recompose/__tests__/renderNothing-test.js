import { expect } from 'chai'
import { renderNothing } from 'recompose'

describe('renderNothing()', () => {
  it('returns a component that renders null', () => {
    const Nothing = renderNothing('div')
    const n = Nothing
    expect(n()).to.be.null
    expect(Nothing.displayName).to.equal('Nothing')
  })
})
