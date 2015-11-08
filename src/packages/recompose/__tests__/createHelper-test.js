import { expect } from 'chai'
import createHelper from '../createHelper'
import lodashCurry from 'lodash/function/curry'

describe('createHelper()', () => {
  const func = (a, b, c) => ({ a, b, c })

  const a = { displayName: 'a' }
  const b = { displayName: 'b' }
  const c = { displayName: 'c' }

  it('works like lodash\'s curry', () => {
    const helper1 = createHelper(func)
    const helper2 = lodashCurry(func)

    const testEqualOutput = callback => {
      const result1 = callback(helper1)
      const result2 = callback(helper2)

      expect(result1.a).to.equal(result2.a)
      expect(result1.b).to.equal(result2.b)
      expect(result1.c).to.equal(result2.c)
    }

    testEqualOutput(helper => helper(a, b, c))
    testEqualOutput(helper => helper(a)(b)(c))
    testEqualOutput(helper => helper()(a, b, c))
    testEqualOutput(helper => helper(null)(b, c))
    testEqualOutput(helper => helper(undefined)(b, c))
  })

  it('properly sets display name', () => {
    expect(
      createHelper(func, 'func')(a, b, c).displayName
    ).to.equal('func(c)')

    expect(
      createHelper(func, 'func', null, false)(a, b, c).displayName
    ).to.be.undefined

    expect(
      createHelper(func, null, null, true)(a, b, c).displayName
    ).to.be.undefined
  })
})
