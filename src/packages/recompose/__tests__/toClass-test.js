import test from 'ava'
import React, { PropTypes } from 'react'
import { toClass, withContext, compose } from '../'
import { mount } from 'enzyme'

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
  const StatelessComponent = props =>
    <div {...props} />

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
  const StatelessComponent = props =>
    <div {...props} />

  StatelessComponent.displayName = 'Stateless'
  StatelessComponent.propTypes = { foo: PropTypes.string }
  StatelessComponent.contextTypes = { bar: PropTypes.object }
  StatelessComponent.defaultProps = { foo: 'bar', fizz: 'buzz' }

  const TestComponent = toClass(StatelessComponent)

  const div = mount(<TestComponent />).find('div')
  t.is(div.prop('foo'), 'bar')
  t.is(div.prop('fizz'), 'buzz')
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
    <div props={props} context={context} />

  StatelessComponent.contextTypes = { store: PropTypes.object }

  const TestComponent = toClass(StatelessComponent)

  const div = mount(
    <Provider store={store}>
      <TestComponent fizz="fizzbuzz" />
    </Provider>
  ).find('div')

  t.is(div.prop('props').fizz, 'fizzbuzz')
  t.is(div.prop('context').store, store)
})

test('toClass works with strings (DOM components)', t => {
  const Div = toClass('div')
  const div = mount(<Div>Hello</Div>).find('div')
  t.is(div.text(), 'Hello')
})
