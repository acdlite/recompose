import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { withState, compose } from 'recompose';
import { BaseComponent, countRenders } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('withState()', () => {
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

  it('accepts setState() callback', () => {
    const Counter2 = compose(
      withState('counter', 'updateCounter', 0),
      countRenders
    )(BaseComponent);

    const tree = renderIntoDocument(<Counter2 pass="through" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);
    const spy = sinon.spy(() => {
      expect(base.props.renderCount).to.equal(2);
    });

    expect(base.props.renderCount).to.equal(1);
    base.props.updateCounter(18, spy);
    expect(spy.callCount).to.eql(1);
  });

});
