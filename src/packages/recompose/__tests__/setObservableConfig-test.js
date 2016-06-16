import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import rxjs5Config from '../rxjsObservableConfig'
import rxjs4Config from '../rxjs4ObservableConfig'
import mostConfig from '../mostObservableConfig'
import xstreamConfig from '../xstreamObservableConfig'
import baconConfig from '../baconObservableConfig'
import setObservableConfig from '../setObservableConfig'
import componentFromStream from '../componentFromStream'

const testTransform = (t, transform) => {
  const Double = componentFromStream(transform)
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  t.is(div.text(), '224')
  wrapper.setProps({ n: 358 })
  t.is(div.text(), '716')
}

test('works with RxJS 5', t => {
  setObservableConfig(rxjs5Config)
  testTransform(t, props$ =>
    props$.map(({ n }) => <div>{n * 2}</div>)
  )
})

test('works with RxJS 4', t => {
  setObservableConfig(rxjs4Config)
  testTransform(t, props$ =>
    props$.map(({ n }) => <div>{n * 2}</div>)
  )
})

test('works with most', t => {
  setObservableConfig(mostConfig)
  testTransform(t, props$ =>
    props$.map(({ n }) => <div>{n * 2}</div>)
  )
})

test('works with xstream', t => {
  setObservableConfig(xstreamConfig)
  testTransform(t, props$ =>
    props$.map(({ n }) => <div>{n * 2}</div>)
  )
})

test('works with bacon', t => {
  setObservableConfig(baconConfig)
  testTransform(t, props$ =>
    props$.map(({ n }) => <div>{n * 2}</div>)
  )
})
