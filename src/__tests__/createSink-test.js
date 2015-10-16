import React from 'react';
import { expect } from 'chai';
import { createSink, compose, withState, mapProps } from 'recompose';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('createSink()', () => {
  it('creates a React component that fires a callback when receiving new props', () => {
    const spy = sinon.spy();
    const Sink = createSink(spy);
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      mapProps(({ updateCounter, ...rest }) => ({
        increment: () => updateCounter(n => n + 1),
        ...rest
      }))
    )(Sink);

    renderIntoDocument(<Counter />);

    const { increment } = spy.lastCall.args[0];
    expect(spy.lastCall.args[0].counter).to.equal(0);
    increment();
    expect(spy.lastCall.args[0].counter).to.equal(1);
    increment();
    expect(spy.lastCall.args[0].counter).to.equal(2);
  });
});
