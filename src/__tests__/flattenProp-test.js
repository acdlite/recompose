import React from 'react';
import { expect } from 'chai';
import { flattenProp } from 'recompose';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('flattenProp()', () => {
  it('flattens an object prop and spreads it into the top-level props object', () => {
    const Counter = flattenProp('state', BaseComponent);

    expect(Counter.displayName).to.equal(
      'flattenProp(BaseComponent)'
    );

    const tree = renderIntoDocument(
      <Counter pass="through" state={{ counter: 1 }} />
    );
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ counter: 1, pass: 'through' });
  });
});
