import React from 'react'
import { mount } from 'enzyme'
import rxjs5Config from '../rxjsObservableConfig'
import rxjs4Config from '../rxjs4ObservableConfig'
import mostConfig from '../mostObservableConfig'
import xstreamConfig from '../xstreamObservableConfig'
import baconConfig from '../baconObservableConfig'
import kefirConfig from '../kefirObservableConfig'
import flydConfig from '../flydObservableConfig'
import setObservableConfig from '../setObservableConfig'
import componentFromStream from '../componentFromStream'

const testTransform = transform => {
  const Double = componentFromStream(transform)
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('224')
  wrapper.setProps({ n: 358 })
  expect(div.text()).toBe('716')
}

test('works with RxJS 5', () => {
  setObservableConfig(rxjs5Config)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})

test('works with RxJS 4', () => {
  setObservableConfig(rxjs4Config)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})

test('works with most', () => {
  setObservableConfig(mostConfig)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})

test('works with xstream', () => {
  setObservableConfig(xstreamConfig)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})

test('works with bacon', () => {
  setObservableConfig(baconConfig)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})

test('works with kefir', () => {
  setObservableConfig(kefirConfig)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})

test('works with flyd', () => {
  setObservableConfig(flydConfig)
  testTransform(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
})
