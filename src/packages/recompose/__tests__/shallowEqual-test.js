import { shallowEqual } from 'recompose';
import { expect } from 'chai';

// Adapted from https://github.com/rackt/react-redux/blob/master/test/utils/shallowEqual.spec.js
describe('shallowEqual()', () => {
  it('returns true if arguments fields are equal', () => {
    expect(
      shallowEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, b: 2, c: undefined }
      )
    ).to.be.true;

    expect(
      shallowEqual(
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 }
      )
    ).to.be.true;

    const o = {};
    expect(
      shallowEqual(
        { a: 1, b: 2, c: o },
        { a: 1, b: 2, c: o }
      )
    ).to.be.true;
  });

  it('returns false if either argument is null or undefined', () => {
    expect(
      shallowEqual(null, { a: 1, b: 2 })
    ).to.be.false;

    expect(
      shallowEqual({ a: 1, b: 2 }, null)
    ).to.be.false;
  });

  it('returns false if first argument has too many keys', () => {
    expect(
      shallowEqual(
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2 }
      )
    ).to.be.false;
  });

  it('returns false if second argument has too many keys', () => {
    expect(
      shallowEqual(
        { a: 1, b: 2 },
        { a: 1, b: 2, c: 3 }
      )
    ).to.be.false;
  });

  it('returns false if arguments have different keys', () => {
    expect(
      shallowEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, bb: 2, c: undefined }
      )
    ).to.be.false;
  });
});
