import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { withReducer, compose, flattenProp } from '../';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('withReducer()', () => {
  const SET_COUNTER = 'SET_COUNTER';

  const reducer = (state, action) => (
    action.type === SET_COUNTER
      ? { counter: action.payload }
      : state
  );

  const initialState = { counter: 0 };

  const Counter = compose(
    withReducer(
      'state',
      'dispatch',
      reducer,
      initialState
    ),
    flattenProp('state')
  )(BaseComponent);

  it('adds a stateful value and a function for updating it', () => {
    expect(Counter.displayName).to.equal(
      'withReducer(flattenProp(BaseComponent))'
    );

    const tree = renderIntoDocument(<Counter pass="through" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, 'dispatch')).to.eql({
      counter: 0,
      pass: 'through'
    });

    base.props.dispatch({ type: SET_COUNTER, payload: 18 });
    expect(omit(base.props, 'dispatch')).to.eql({
      counter: 18,
      pass: 'through'
    });
  });
});
