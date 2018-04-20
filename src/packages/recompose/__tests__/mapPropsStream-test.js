import React from 'react'
import { mount } from 'enzyme'
import setObservableConfig from '../setObservableConfig'
import rxjs4Config from '../rxjs4ObservableConfig'
import { mapPropsStream } from '../'

setObservableConfig(rxjs4Config)

// Most of mapPropsStream's functionality is covered by componentFromStream
test('mapPropsStream creates a higher-order component from a stream', () => {
  const Double = mapPropsStream(props$ =>
    props$.map(({ n }) => ({ children: n * 2 }))
  )('div')
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('224')
  wrapper.setProps({ n: 358 })
  expect(div.text()).toBe('716')
})

test('mapPropsStream throws errors produced by stream', () => {
  const Double = mapPropsStream(props$ =>
    props$.map(({ n }) => {
      if (n > 0) {
        return { children: n * 2 }
      }

      throw new Error('n is too low')
    })
  )('div')

  const wrapper = mount(<Double n={1} />)
  expect(wrapper.text()).toBe('2')
  expect(() => wrapper.setProps({ n: 0 })).toThrowError('n is too low')
})
