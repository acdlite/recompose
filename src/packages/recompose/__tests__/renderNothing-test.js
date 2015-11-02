import { expect } from 'chai';
import { renderNothing } from 'recompose';

describe('mapProps()', () => {
  it('maps owner props to child props', () => {
    const Nothing = renderNothing('div');
    const n = Nothing;
    expect(n()).to.be.null;
    expect(Nothing.displayName).to.equal('Nothing');
  });
});
