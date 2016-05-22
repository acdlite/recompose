import React from 'react'
import test from 'ava'
import createHocFromMiddleware from '../createHocFromMiddleware'
import { mount } from 'enzyme'

test('createHocFromMiddleware gives access to current props', t => {
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

  const Div = createHocFromMiddleware(m1, m2)('div')
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
})
