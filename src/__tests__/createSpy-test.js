import React from 'react';
import { expect } from 'chai';
import { createSpy, compose, withState, branch } from 'recompose';
import omit from 'lodash/object/omit';
import { NullComponent } from './utils';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('createSpy', () => {
  it('creates a higher-order component that tracks component instances and the props they receive', () => {
    const spy = createSpy();

    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      branch(
        props => props.counter === 123,
        () => NullComponent,
        spy
      )
    )('div');

    renderIntoDocument(<Counter />);
    const { updateCounter } = spy.getProps(0, 0);

    updateCounter(1);
    updateCounter(2);

    expect(omit(spy.getProps(0, 0), 'updateCounter')).to.eql({ counter: 0 });
    expect(omit(spy.getProps(0, 1), 'updateCounter')).to.eql({ counter: 1 });
    expect(omit(spy.getProps(0, 2), 'updateCounter')).to.eql({ counter: 2 });

    expect(spy.getComponentInfo().length).to.equal(1);
    updateCounter(123); // Unmount spy
    expect(spy.getComponentInfo().length).to.equal(0);
  });
});
