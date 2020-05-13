import React from 'react'
import { mount } from 'enzyme'
import { Stream as MostStream } from 'most'
import { Observable } from 'rxjs'
import { mapPropsStreamWithConfig } from '../'
import rxConfig from '../rxjsObservableConfig'
import mostConfig from '../mostObservableConfig'

// Most of mapPropsStreamConfig's functionality is covered by componentFromStream
test('mapPropsStreamWithConfig creates a higher-order component from a stream and a observable config', () => {
  const Double = mapPropsStreamWithConfig(rxConfig)(props$ =>
    props$.map(({ n }) => ({ children: n * 2 }))
  )('div')
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('224')
  wrapper.setProps({ n: 358 })
  expect(div.text()).toBe('716')
})

test('mapPropsStreamWithConfig creates a stream with the correct config', () => {
  const MostComponent = mapPropsStreamWithConfig(mostConfig)(props$ => {
    expect(props$ instanceof MostStream).toBe(true)
    return props$.map(v => v)
  })('div')

  mount(<MostComponent />)

  const RXJSComponent = mapPropsStreamWithConfig(rxConfig)(props$ => {
    expect(props$ instanceof Observable).toBe(true)
    return props$.map(v => v)
  })('div')

  mount(<RXJSComponent />)
})
