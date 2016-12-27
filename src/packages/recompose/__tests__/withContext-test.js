import test from 'ava'
import React, { Component, PropTypes } from 'react'
import { withContext, getContext, compose, mapProps } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('withContext + getContext adds to and grabs from context', t => {
  // Mini React Redux clone
  const store = {
    getState: () => ({
      todos: ['eat', 'drink', 'sleep'],
      counter: 12
    })
  }

  class BaseProvider extends Component {
    static propTypes = {
      children: PropTypes.node
    };

    render() {
      return this.props.children
    }
  }

  const Provider = compose(
    withContext(
      { store: PropTypes.object },
      props => ({ store: props.store })
    )
  )(BaseProvider)

  t.is(Provider.displayName, 'withContext(BaseProvider)')

  const connect = selector => compose(
    getContext({ store: PropTypes.object }),
    mapProps(props => selector(props.store.getState()))
  )

  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const TodoList = connect(({ todos }) => ({ todos }))(component)

  t.is(TodoList.displayName, 'getContext(mapProps(component))')

  mount(
    <Provider store={store}>
      <TodoList />
    </Provider>
  )

  t.deepEqual(component.lastCall.args[0].todos, ['eat', 'drink', 'sleep'])
})
