/* eslint-disable react/require-default-props */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { withContext, getContext, compose, mapProps } from '../'

test('withContext + getContext adds to and grabs from context', () => {
  // Mini React Redux clone
  const store = {
    getState: () => ({
      todos: ['eat', 'drink', 'sleep'],
      counter: 12,
    }),
  }

  class BaseProvider extends Component {
    static propTypes = {
      children: PropTypes.node,
    }

    render() {
      return this.props.children
    }
  }

  const Provider = compose(
    withContext({ store: PropTypes.object }, props => ({ store: props.store }))
  )(BaseProvider)

  expect(Provider.displayName).toBe('withContext(BaseProvider)')

  const connect = selector =>
    compose(
      getContext({ store: PropTypes.object }),
      mapProps(props => selector(props.store.getState()))
    )

  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const TodoList = connect(({ todos }) => ({ todos }))(component)

  expect(TodoList.displayName).toBe('getContext(mapProps(component))')

  mount(
    <Provider store={store}>
      <TodoList />
    </Provider>
  )

  expect(component.lastCall.args[0].todos).toEqual(['eat', 'drink', 'sleep'])
})
