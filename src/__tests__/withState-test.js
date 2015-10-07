import React from 'react';
import { expect } from 'chai';
import jsdom from 'mocha-jsdom';
import omit from 'lodash/object/omit';
import { withState } from '../';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('withState()', () => {
  jsdom();

  const Counter = withState('counter', 'updateCounter', 0)(BaseComponent);

  it('adds a stateful value and a function for updating it', () => {
    expect(Counter.displayName).to.equal(
      'withState(BaseComponent)'
    );

    const tree = renderIntoDocument(<Counter pass="through" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, 'updateCounter')).to.eql({
      counter: 0,
      pass: 'through'
    });

    base.props.updateCounter(n => n + 9);
    base.props.updateCounter(n => n * 2);
    expect(omit(base.props, 'updateCounter')).to.eql({
      counter: 18,
      pass: 'through'
    });
  });

  it('also accepts a non-function, which is passed directly to setState()', () => {
    const tree = renderIntoDocument(<Counter pass="through" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    base.props.updateCounter(18);
    expect(omit(base.props, 'updateCounter')).to.eql({
      counter: 18,
      pass: 'through'
    });
  });
});
