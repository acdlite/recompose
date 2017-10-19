import React from 'react'
import { mount } from 'enzyme'
import { lifecycle, compose, withProps } from '../'

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

test('lifecycle can take fn that has props to generate hooks', () => {
  const enhance = compose(
    withProps({
      'data-test': 30,
    }),
    lifecycle(props => ({
      componentWillMount() {
        this.setState({
          'data-bar': 'baz',
          'data-test': props['data-test'] * 3,
        })
      },
    }))
  )
  const Div = enhance('div')
  expect(Div.displayName).toBe('withProps(lifecycle(div))')

  const div = mount(<Div data-foo="bar" />).find('div')
  expect(div.prop('data-foo')).toBe('bar')
  expect(div.prop('data-bar')).toBe('baz')
  expect(div.prop('data-test')).toBe(90)
})
