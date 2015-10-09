import React from 'react';
import { expect } from 'chai';
import { withProps, renameProps, compose } from 'recompose';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('renameProps()', () => {
  it('renames props', () => {
    const StringConcat = compose(
      withProps({ so: 123, la: 456 }),
      renameProps({ so: 'do', la: 'fa' }),
    )(BaseComponent);

    expect(StringConcat.displayName).to.equal(
      'withProps(renameProps(BaseComponent))'
    );

    const tree = renderIntoDocument(<StringConcat />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ do: 123, fa: 456 });
  });
});
