import React, { Component, PropTypes } from 'react';
import { expect } from 'chai';
import { withContext, getContext, compose, mapProps } from 'recompose';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('withContext() / getContext()', () => {
  it('adds to and grabs from context', () => {
    // Mini React Redux clone
    const store = {
      getState: () => ({
        todos: [ 'eat', 'drink', 'sleep' ],
        counter: 12
      })
    };

    class Provider extends Component {
      static propTypes = {
        children: PropTypes.node
      };

      render() {
        return this.props.children;
      }
    }

    Provider = compose(
      withContext(
        { store: PropTypes.object },
        props => ({ store: props.store })
      )
    )(Provider);

    expect(Provider.displayName).to.equal(
      'withContext(Provider)'
    );

    const connect = selector => compose(
      getContext({ store: PropTypes.object }),
      mapProps(props => selector(props.store.getState()))
    );

    const TodoList = connect(
      ({ todos }) => ({ todos })
    )(BaseComponent);

    expect(TodoList.displayName).to.equal(
      'getContext(mapProps(BaseComponent))'
    );

    const tree = renderIntoDocument(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props.todos).to.eql([ 'eat', 'drink', 'sleep' ]);
  });
});
