import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { onlyUpdateForKeys, compose, withState } from '../';
import { BaseComponent, countRenders } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('onlyUpdateForKeys()', () => {
  it('implements shouldComponentUpdate()', () => {
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      onlyUpdateForKeys(['counter']),
      countRenders
    )(BaseComponent);

    expect(Counter.displayName).to.equal(
      'withState(withState(onlyUpdateForKeys(countRenders(BaseComponent))))'
    );

    const tree = renderIntoDocument(<Counter pass="through" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 0,
      foobar: 'foobar',
      pass: 'through',
      renderCount: 1
    });

    base.props.updateFoobar(() => 'barbaz');
    expect(omit(base.props, ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 0,
      foobar: 'foobar',
      pass: 'through',
      renderCount: 1
    });

    base.props.updateCounter(n => n + 1);
    expect(omit(base.props, ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 1,
      pass: 'through',
      foobar: 'barbaz',
      renderCount: 2
    });
  });
});
