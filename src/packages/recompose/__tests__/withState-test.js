import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { withState, compose } from 'recompose';
import createSpy from 'recompose/createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('withState()', () => {
  const spy = createSpy();
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    spy
  )('div');

  it('adds a stateful value and a function for updating it', () => {
    expect(Counter.displayName).to.equal(
      'withState(spy(div))'
    );

    renderIntoDocument(<Counter pass="through" />);

    expect(omit(spy.getProps(), 'updateCounter')).to.eql({
      counter: 0,
      pass: 'through'
    });

    spy.getProps().updateCounter(n => n + 9);
    spy.getProps().updateCounter(n => n * 2);
    expect(omit(spy.getProps(), 'updateCounter')).to.eql({
      counter: 18,
      pass: 'through'
    });
  });

  it('also accepts a non-function, which is passed directly to setState()', () => {
    renderIntoDocument(<Counter pass="through" />);

    spy.getProps().updateCounter(18);
    expect(omit(spy.getProps(), 'updateCounter')).to.eql({
      counter: 18,
      pass: 'through'
    });
  });

  it('accepts setState() callback', () => {
    const Counter2 = compose(
      withState('counter', 'updateCounter', 0),
      spy
    )('div');

    renderIntoDocument(<Counter2 pass="through" />);
    const renderSpy = sinon.spy(() => {
      expect(spy.getRenderCount()).to.equal(2);
    });

    expect(spy.getRenderCount()).to.equal(1);
    spy.getProps().updateCounter(18, renderSpy);
    expect(renderSpy.callCount).to.eql(1);
  });

  it('also accepts initialState as function of props', () => {
    const spy2 = createSpy();
    const Counter3 = compose(
      withState('counter', 'updateCounter', props => props.initialCounter),
      spy2
    )('div');

    renderIntoDocument(<Counter3 initialCounter={1} />);

    expect(spy2.getProps().counter).to.equal(1);
    spy2.getProps().updateCounter(n => n * 3);
    expect(spy2.getProps().counter).to.equal(3);
  });

});
