import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import { lifecycle } from '../'

test('lifecycle is a higher-order component version of React.createClass', t => {
  const enhance = lifecycle({
    componentWillMount() {
      this.setState({ bar: 'baz' })
    }
  })
  const Div = enhance('div')
  t.is(Div.displayName, 'lifecycle(div)')

  const div = mount(<Div foo="bar" />).find('div')
  t.is(div.prop('foo'), 'bar')
  t.is(div.prop('bar'), 'baz')
})
