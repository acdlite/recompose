import React from 'react'
import test from 'ava'
import { mount } from 'enzyme'
import createHocFromMiddleware from '../createHocFromMiddleware'
import { compose } from '../../'

const m1 = ({ getProps }) => next => ({
  update: ({ foo, ...rest }) => {
    const currentProps = getProps()
    next.update({
      ...rest,
      currentFoo: foo,
      previousFoo: currentProps && currentProps.foo
    })
  }
})

const m2 = ({ getProps }) => next => ({
  update: ({ bar, ...rest }) => {
    const currentProps = getProps()
    next.update({
      ...rest,
      currentBar: bar,
      previousBar: currentProps && currentProps.bar
    })
  }
})

const hoc1 = createHocFromMiddleware(m1)
const hoc2 = createHocFromMiddleware(m2)

// Does not use middleware, so will create an extra class
const identityHoc = BaseComponent =>
  class extends React.Component {
    render() {
      return <BaseComponent {...this.props} />
    }
  }

const getNumberOfComponents = wrapper =>
  wrapper.findWhere(w => typeof w.type() !== 'string').length

const assertHoc = (t, testHoc, expectedNumberOfComponents) => {
  const Div = testHoc('div')
  const wrapper = mount(<Div foo={1} bar={2} />)
  const div = wrapper.find('div')

  t.is(div.prop('currentFoo'), 1)
  t.is(div.prop('previousFoo'), undefined)
  t.is(div.prop('currentBar'), 2)
  t.is(div.prop('previousBar'), undefined)

  wrapper.setProps({ foo: 2, bar: 3 })
  t.is(div.prop('currentFoo'), 2)
  t.is(div.prop('previousFoo'), 1)
  t.is(div.prop('currentBar'), 3)
  t.is(div.prop('previousBar'), 2)

  const numberOfComponents = getNumberOfComponents(wrapper)
  t.is(numberOfComponents, expectedNumberOfComponents)

  return wrapper
}

test('createHocFromMiddleware gives access to current props', t => {
  assertHoc(t, createHocFromMiddleware(m1, m2), 1)
})

test('createHocFromMiddleware squashes with middleware from base component', t => {
  assertHoc(t, compose(hoc1, hoc2), 1)
  assertHoc(t, compose(hoc1, hoc2, identityHoc), 2)
  assertHoc(t, compose(hoc1, identityHoc, hoc2), 3)
  assertHoc(t, compose(identityHoc, hoc1, hoc2), 2)
})
