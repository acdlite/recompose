import React from 'react';
import { expect } from 'chai';
import { flattenProp, compose } from 'recompose';
import createSpy from 'recompose/createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('flattenProp()', () => {
  it('flattens an object prop and spreads it into the top-level props object', () => {
    const spy = createSpy();
    const Counter = compose(
      flattenProp('state'),
      spy
    )('div');

    expect(Counter.displayName).to.equal(
      'flattenProp(spy(div))'
    );

    renderIntoDocument(
      <Counter pass="through" state={{ counter: 1 }} />
    );

    expect(spy.getProps()).to.eql({ counter: 1, pass: 'through' });
  });
});
