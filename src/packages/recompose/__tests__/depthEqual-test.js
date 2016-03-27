import depthEqual from '../depthEqual'
import { expect } from 'chai'

// Adapted from https://github.com/rackt/react-redux/blob/master/test/utils/shallowEqual.spec.js
describe('depthEqual()', () => {
  it('returns true if arguments are equal', () => {
    expect(depthEqual(expect, expect)).to.be.true
    expect(depthEqual(expect, expect, 0)).to.be.true
    expect(depthEqual(2, 2)).to.be.true
    expect(depthEqual(2, 2, 0)).to.be.true
  })

  it('returns false if depth is 0 and !==', () => {
    expect(
      depthEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, b: 2, c: undefined },
        0
      )
    ).to.be.false
  })

  it('returns true if depth is 1 and arguments fields are equal', () => {
    expect(
      depthEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, b: 2, c: undefined },
        1
      )
    ).to.be.true

    expect(
      depthEqual(
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 }
        // 1 should be default arg
      )
    ).to.be.true

    const o = {}
    expect(
      depthEqual(
        { a: 1, b: 2, c: o },
        { a: 1, b: 2, c: o }
      )
    ).to.be.true
  })

  it('returns false if either argument is null or undefined', () => {
    expect(
      depthEqual(null, { a: 1, b: 2 })
    ).to.be.false

    expect(
      depthEqual({ a: 1, b: 2 }, null)
    ).to.be.false
  })

  it('returns false if first argument has too many keys', () => {
    expect(
      depthEqual(
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2 }
      )
    ).to.be.false
  })

  it('returns false if second argument has too many keys', () => {
    expect(
      depthEqual(
        { a: 1, b: 2 },
        { a: 1, b: 2, c: 3 }
      )
    ).to.be.false
  })

  it('returns false if arguments have different keys', () => {
    expect(
      depthEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, bb: 2, c: undefined }
      )
    ).to.be.false
  })

  it('returns true if depth is 2 and arguments have nested objects', () => {
    expect(
      depthEqual(
        { a: { b: 1, c: 2 }, b: 2, c: undefined },
        { a: { b: 1, c: 2 }, b: 2, c: undefined },
        2
      )
    ).to.be.true

    expect(
      depthEqual(
        { a: { b: 1, c: 2 }, b: 2, c: undefined },
        { a: { b: 1, c: 2 }, b: 2, c: undefined }
      )
    ).to.be.false
  })

  it('returns false if depth is 2 and arguments have non-equal nested objects', () => {
    expect(
      depthEqual(
        { a: { b: 1, c: 2 }, b: 2, c: undefined },
        { a: { b: 1, c: 44 }, b: 2, c: undefined },
        2
      )
    ).to.be.false
  })

  it('returns true if depth is 3 and arguments have doubly-nested objects', () => {
    expect(
      depthEqual(
        { a: { b: 1, c: { d: 2 } }, e: 2, f: { g: 3 } },
        { a: { b: 1, c: { d: 2 } }, e: 2, f: { g: 3 } },
        3
      )
    ).to.be.true

    expect(
      depthEqual(
        { a: { b: 1, c: { d: 2 } }, e: 2, f: { g: 3 } },
        { a: { b: 1, c: { d: 2 } }, e: 2, f: { g: 3 } },
        2
      )
    ).to.be.false
  })
})
