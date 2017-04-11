import test from 'ava'
import React from 'react'
import { compose, withRefs } from '../'
import { countRenders } from './utils'
import { mount } from 'enzyme'

test('withRefs creates component with right displayName', t => {
  const WithRef = withRefs({ inner: 'initInner' })('div')
  t.is(WithRef.displayName, 'withRefs(div)')
})

test('withRefs adds a function to init ref and an object with ref', t => {
  const BaseComponent = ({ initInner }) =>
    <div className="referenced" ref={initInner} />

  const WithRef = compose(
    withRefs({ inner: 'initInner' }),
    countRenders
  )(BaseComponent)

  const wrapper = mount(<WithRef pass="through" />)
  const base = wrapper.find(BaseComponent)

  t.is(base.prop('pass'), 'through')
  t.is(base.prop('renderCount'), 1)
  t.is(base.prop('refs').inner.className, 'referenced')
})
