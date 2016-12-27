import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import { lifecycle } from '../'

test('lifecycle is a higher-order component version of React.createClass', t => {
  const enhance = lifecycle({
    componentWillMount() {
      this.setState({ 'data-bar': 'baz' })
    }
  })
  const Div = enhance('div')
  t.is(Div.displayName, 'lifecycle(div)')

  const div = mount(<Div data-foo="bar" />).find('div')
  t.is(div.prop('data-foo'), 'bar')
  t.is(div.prop('data-bar'), 'baz')
})
