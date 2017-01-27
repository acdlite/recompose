import test from 'ava'
import React, { PropTypes } from 'react'
import { toClass, withContext, compose } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('toClass returns the base component if it is already a class', t => {
  class BaseComponent extends React.Component {
    render() {
      return <div />
    }
  }

  const TestComponent = toClass(BaseComponent)
  t.is(TestComponent, BaseComponent)
})

test('toClass copies propTypes, displayName, contextTypes and defaultProps from base component', t => {
  const StatelessComponent = () =>
    <div />

  StatelessComponent.displayName = 'Stateless'
  StatelessComponent.propTypes = { foo: PropTypes.string }
  StatelessComponent.contextTypes = { bar: PropTypes.object }
  StatelessComponent.defaultProps = { foo: 'bar', fizz: 'buzz' }

  const TestComponent = toClass(StatelessComponent)

  t.is(TestComponent.displayName, 'Stateless')
  t.deepEqual(TestComponent.propTypes, { foo: PropTypes.string })
  t.deepEqual(TestComponent.contextTypes, { bar: PropTypes.object })
  t.deepEqual(TestComponent.defaultProps, { foo: 'bar', fizz: 'buzz' })
})

test('toClass passes defaultProps correctly', t => {
  const StatelessComponent = sinon.spy(() => null)

  StatelessComponent.displayName = 'Stateless'
  StatelessComponent.propTypes = { foo: PropTypes.string }
  StatelessComponent.contextTypes = { bar: PropTypes.object }
  StatelessComponent.defaultProps = { foo: 'bar', fizz: 'buzz' }

  const TestComponent = toClass(StatelessComponent)

  mount(<TestComponent />)
  t.is(StatelessComponent.lastCall.args[0].foo, 'bar')
  t.is(StatelessComponent.lastCall.args[0].fizz, 'buzz')
})

test('toClass passes context and props correctly', t => {
  const store = {}

  class Provider extends React.Component {
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


  const StatelessComponent = (props, context) =>
    <div data-props={props} data-context={context} />

  StatelessComponent.contextTypes = { store: PropTypes.object }

  const TestComponent = toClass(StatelessComponent)

  const div = mount(
    <Provider store={store}>
      <TestComponent fizz="fizzbuzz" />
    </Provider>
  ).find('div')

  t.is(div.prop('data-props').fizz, 'fizzbuzz')
  t.is(div.prop('data-context').store, store)
})

test('toClass works with strings (DOM components)', t => {
  const Div = toClass('div')
  const div = mount(<Div>Hello</Div>)
  t.is(div.html(), '<div>Hello</div>')
})
