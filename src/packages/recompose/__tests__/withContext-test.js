import test from 'ava'
import React, { Component, PropTypes } from 'react'
import { withContext, getContext, compose, mapProps } from '../'
import { mount } from 'enzyme'

test('withContext + getContext adds to and grabs from context', t => {
  // Mini React Redux clone
  const store = {
    getState: () => ({
      todos: [ 'eat', 'drink', 'sleep' ],
      counter: 12
    })
  }

  class Provider extends Component {
    static propTypes = {
      children: PropTypes.node
    };

    render() {
      return this.props.children
    }
  }

  Provider = compose(
    withContext(
      { store: PropTypes.object },
      props => ({ store: props.store })
    )
  )(Provider)

  t.is(Provider.displayName, 'withContext(Provider)')

  const connect = selector => compose(
    getContext({ store: PropTypes.object }),
    mapProps(props => selector(props.store.getState()))
  )

  const TodoList = connect(({ todos }) => ({ todos }))('div')

  t.is(TodoList.displayName, 'getContext(mapProps(div))')

  const div = mount(
    <Provider store={store}>
      <TodoList />
    </Provider>
  ).find('div')

  t.deepEqual(div.prop('todos'), [ 'eat', 'drink', 'sleep' ])
})
