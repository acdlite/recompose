import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { pure, compose, withState } from '../';
import { BaseComponent, countRenders } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('pure()', () => {
  it('implements shouldComponentUpdate() using shallowEqual()', () => {
    const initialTodos = ['eat', 'drink', 'sleep'];
    const Counter = compose(
      withState('todos', 'updateTodos', initialTodos),
      pure,
      countRenders
    )(BaseComponent);

    expect(Counter.displayName).to.equal(
      'withState(pure(countRenders(BaseComponent)))'
    );

    const tree = renderIntoDocument(<Counter pass="through" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, 'updateTodos')).to.eql({
      todos: initialTodos,
      pass: 'through',
      renderCount: 1
    });

    base.props.updateTodos(initialTodos);
    expect(omit(base.props, 'updateTodos')).to.eql({
      todos: initialTodos,
      pass: 'through',
      renderCount: 1
    });

    base.props.updateTodos(todos => todos.slice(0, -1));
    expect(omit(base.props, 'updateTodos')).to.eql({
      todos: ['eat', 'drink'],
      pass: 'through',
      renderCount: 2
    });
  });
});
