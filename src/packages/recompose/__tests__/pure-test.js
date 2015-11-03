import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { pure, compose, withState } from 'recompose';
import createSpy from 'recompose/createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('pure()', () => {
  it('implements shouldComponentUpdate() using shallowEqual()', () => {
    const spy = createSpy();
    const initialTodos = ['eat', 'drink', 'sleep'];
    const Counter = compose(
      withState('todos', 'updateTodos', initialTodos),
      pure,
      spy
    )('div');

    expect(Counter.displayName).to.equal(
      'withState(pure(spy(div)))'
    );

    renderIntoDocument(<Counter pass="through" />);

    expect(omit(spy.getProps(), 'updateTodos')).to.eql({
      todos: initialTodos,
      pass: 'through'
    });
    expect(spy.getRenderCount()).to.equal(1);

    spy.getProps().updateTodos(initialTodos);
    expect(omit(spy.getProps(), 'updateTodos')).to.eql({
      todos: initialTodos,
      pass: 'through'
    });
    expect(spy.getRenderCount()).to.equal(1);

    spy.getProps().updateTodos(todos => todos.slice(0, -1));
    expect(omit(spy.getProps(), 'updateTodos')).to.eql({
      todos: ['eat', 'drink'],
      pass: 'through'
    });
    expect(spy.getRenderCount()).to.equal(2);
  });
});
