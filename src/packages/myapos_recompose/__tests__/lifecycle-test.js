import React from 'react'
import { mount } from 'enzyme'
import { lifecycle } from '../'

test('lifecycle is a higher-order component version of React.Component', () => {
  const enhance = lifecycle({
    componentWillMount() {
      this.setState({ 'data-bar': 'baz' })
    },
  })
  const Div = enhance('div')
  expect(Div.displayName).toBe('lifecycle(div)')

  const div = mount(<Div data-foo="bar" />).find('div')
  expect(div.prop('data-foo')).toBe('bar')
  expect(div.prop('data-bar')).toBe('baz')
})
