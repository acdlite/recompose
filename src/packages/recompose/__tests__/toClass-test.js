import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { toClass, withContext, compose } from 'recompose'
import { mount } from 'enzyme'

describe('toClass()', () => {
  it('returns the base component if it is already a class', () => {
    class BaseComponent extends React.Component {
      render() {
        return <div />
      }
    }

    const TestComponent = toClass(BaseComponent)
    expect(TestComponent).to.equal(BaseComponent)
  })

  it('copies propTypes, displayName, contextTypes and defaultProps from base component', () => {
    const StatelessComponent = props =>
      <div {...props} />

    StatelessComponent.displayName = 'Stateless'
    StatelessComponent.propTypes = { foo: PropTypes.string }
    StatelessComponent.contextTypes = { bar: PropTypes.object }
    StatelessComponent.defaultProps = { foo: 'bar', fizz: 'buzz' }

    const TestComponent = toClass(StatelessComponent)

    expect(TestComponent.displayName).to.equal('Stateless')
    expect(TestComponent.propTypes).to.eql({ foo: PropTypes.string })
    expect(TestComponent.contextTypes).to.eql({ bar: PropTypes.object })
    expect(TestComponent.defaultProps).to.eql({ foo: 'bar', fizz: 'buzz' })
  })

  it('passes defaultProps correctly', () => {
    const StatelessComponent = props =>
      <div {...props} />

    StatelessComponent.displayName = 'Stateless'
    StatelessComponent.propTypes = { foo: PropTypes.string }
    StatelessComponent.contextTypes = { bar: PropTypes.object }
    StatelessComponent.defaultProps = { foo: 'bar', fizz: 'buzz' }

    const TestComponent = toClass(StatelessComponent)

    const div = mount(<TestComponent />).find('div')
    expect(div.props()).to.eql({ foo: 'bar', fizz: 'buzz' })
  })

  it('passes context and props correctly', () => {
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

    expect(div.prop('props').fizz).to.equal('fizzbuzz')
    expect(div.prop('context').store).to.equal(store)
  })

  it('works with strings (DOM components)', () => {
    const Div = toClass('div')
    const div = mount(<Div>Hello</Div>).find('div')
    expect(div.text()).to.equal('Hello')
  })
})
