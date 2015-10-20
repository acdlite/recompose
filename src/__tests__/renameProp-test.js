import React from 'react';
import { expect } from 'chai';
import { withProps, renameProp, compose } from 'recompose';
import createSpy from './createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('renameProp()', () => {
  it('renames a single prop', () => {
    const spy = createSpy();
    const StringConcat = compose(
      withProps({ so: 123, la: 456 }),
      renameProp('so', 'do'),
      spy
    )('div');

    expect(StringConcat.displayName).to.equal(
      'withProps(renameProp(spy(div)))'
    );

    renderIntoDocument(<StringConcat />);

    expect(spy.getProps()).to.eql({ do: 123, la: 456 });
  });
});
