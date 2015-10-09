import React from 'react';
import { expect } from 'chai';
import { withProps, renameProp, compose } from 'recompose';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('renameProp()', () => {
  it('renames a single prop', () => {
    const StringConcat = compose(
      withProps({ so: 123, la: 456 }),
      renameProp('so', 'do'),
    )(BaseComponent);

    expect(StringConcat.displayName).to.equal(
      'withProps(renameProp(BaseComponent))'
    );

    const tree = renderIntoDocument(<StringConcat />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ do: 123, la: 456 });
  });
});
