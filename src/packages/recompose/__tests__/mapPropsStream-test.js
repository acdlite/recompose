import test from 'ava'
import React from 'react'
import setObservableConfig from '../setObservableConfig'
import rxjs4Config from '../rxjs4ObservableConfig'
import { mount } from 'enzyme'
import { mapPropsStream } from '../'

setObservableConfig(rxjs4Config)

// Most of mapPropsStream's functionality is covered by componentFromStream
test('mapPropsStream creates a higher-order component from a stream', t => {
  const Double = mapPropsStream(props$ =>
    props$.map(({ n }) => ({ children: n * 2 }))
  )('div')
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  t.is(div.text(), '224')
  wrapper.setProps({ n: 358 })
  t.is(div.text(), '716')
})
