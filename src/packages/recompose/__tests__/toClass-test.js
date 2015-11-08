import React, { PropTypes } from 'react'
import { expect } from 'chai'
import { toClass, withContext, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('toClass()', () => {
  it('should return the base component if it is already a class', () => {
    class BaseComponent extends React.Component {
      render() {
        return <div />
      }
    }

    const TestComponent = toClass(BaseComponent)
    expect(TestComponent).to.equal(BaseComponent)
  })

  const spy = createSpy()
  const Spy = spy('div')
  const StatelessComponent = (props, context) => (
    <Spy props={props} context={context}/>
  )
  StatelessComponent.displayName = 'Stateless'
  StatelessComponent.propTypes = { foo: PropTypes.string }
  StatelessComponent.contextTypes = { bar: PropTypes.object }
  StatelessComponent.defaultProps = { foo: 'bar', fizz: 'buzz' }

  const TestComponent = toClass(StatelessComponent)

  it('should copy propTypes, displayName, contextTypes and defaultProps from base component', () => {
    expect(TestComponent.displayName).to.equal('Stateless')
    expect(TestComponent.propTypes).to.eql({ foo: PropTypes.string })
    expect(TestComponent.contextTypes).to.eql({ bar: PropTypes.object })
    expect(TestComponent.defaultProps).to.eql({ foo: 'bar', fizz: 'buzz' })
  })

  it('should pass defaultProps correctly', () => {
    renderIntoDocument(<TestComponent />)
    expect(spy.getProps().props).to.eql({ foo: 'bar', fizz: 'buzz' })
  })

  it('should pass context and props correctly', () => {
    const store = {}

    class Provider extends React.Component {
      static propTypes = {
        children: PropTypes.node
      }

      render() {
        return this.props.children
      }
    }

    Provider = compose(
      withContext(
        { bar: PropTypes.object },
        props => ({ bar: props.store })
      )
    )(Provider)


    renderIntoDocument(
      <Provider store={store}>
        <TestComponent fizz="fizzbuzz" />
      </Provider>
    )

    expect(spy.getProps().context.bar).to.equal(store)
    expect(spy.getProps().props.fizz).to.equal('fizzbuzz')

  })
})
