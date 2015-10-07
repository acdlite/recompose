import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { shouldUpdate, compose, withState } from '../';
import { BaseComponent, countRenders } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('shouldUpdate()', () => {
  it('implements shouldComponentUpdate()', () => {
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      shouldUpdate((props, nextProps) => props.counter !== nextProps.counter),
      countRenders
    )(BaseComponent);

    expect(Counter.displayName).to.equal(
      'withState(withState(shouldUpdate(countRenders(BaseComponent))))'
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
