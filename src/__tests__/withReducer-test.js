import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { withReducer, compose, flattenProp } from 'recompose';
import createSpy from './createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('withReducer()', () => {
  const SET_COUNTER = 'SET_COUNTER';

  const reducer = (state, action) => (
    action.type === SET_COUNTER
      ? { counter: action.payload }
      : state
  );

  const initialState = { counter: 0 };

  const spy = createSpy();
  const Counter = compose(
    withReducer(
      'state',
      'dispatch',
      reducer,
      initialState
    ),
    flattenProp('state'),
    spy
  )('div');

  it('adds a stateful value and a function for updating it', () => {
    expect(Counter.displayName).to.equal(
      'withReducer(flattenProp(spy(div)))'
    );

    renderIntoDocument(<Counter pass="through" />);

    expect(omit(spy.getProps(), 'dispatch')).to.eql({
      counter: 0,
      pass: 'through'
    });

    spy.getProps().dispatch({ type: SET_COUNTER, payload: 18 });
    expect(omit(spy.getProps(), 'dispatch')).to.eql({
      counter: 18,
      pass: 'through'
    });
  });
});
