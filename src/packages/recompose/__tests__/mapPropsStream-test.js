import React from 'react'
import { mount } from 'enzyme'
import { mapPropsStream } from '../rxjs'
// Existing check
/* eslint-disable */
import { mapPropsStream as rxjs4 } from '../rxjs4'
import { mapPropsStream as bacon } from '../bacon'
import { mapPropsStream as flyd } from '../flyd'
import { mapPropsStream as kefir } from '../kefir'
import { mapPropsStream as most } from '../most'
import { mapPropsStream as xstream } from '../xstream'
/* eslint-enable */

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
