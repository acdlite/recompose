import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { shouldUpdate, compose, withState, createSpy } from 'recompose';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('shouldUpdate()', () => {
  it('implements shouldComponentUpdate()', () => {
    const spy = createSpy();
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      shouldUpdate((props, nextProps) => props.counter !== nextProps.counter),
      spy
    )('div');

    expect(Counter.displayName).to.equal(
      'withState(withState(shouldUpdate(spy(div))))'
    );

    renderIntoDocument(<Counter pass="through" />);

    expect(omit(spy.getProps(), ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 0,
      foobar: 'foobar',
      pass: 'through'
    });
    expect(spy.getRenderCount()).to.equal(1);

    spy.getProps().updateFoobar(() => 'barbaz');
    expect(omit(spy.getProps(), ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 0,
      foobar: 'foobar',
      pass: 'through'
    });
    expect(spy.getRenderCount()).to.equal(1);

    spy.getProps().updateCounter(n => n + 1);
    expect(omit(spy.getProps(), ['updateCounter', 'updateFoobar'])).to.eql({
      counter: 1,
      pass: 'through',
      foobar: 'barbaz'
    });
    expect(spy.getRenderCount()).to.equal(2);
  });
});
