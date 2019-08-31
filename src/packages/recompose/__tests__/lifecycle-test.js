import React from 'react'
import { mount } from 'enzyme'
import { lifecycle } from '../'

const ExampleComponent = ({ title }) => <h1>{title}</h1>

test('lifecycle is a higher-order component version of React.Component', () => {
  const enhance = lifecycle({
    componentWillMount: () => () => {},
  })
  const TestComponent = enhance(ExampleComponent)
  const mountedComponent = mount(<TestComponent title="Awesome title" />)
  expect(mountedComponent.props().title).toBe('Awesome title')
})

test('lifecycle hooks should inject props', done => {
  const enhance = lifecycle({
    componentDidMount: props => () => {
      expect(props.title).toBe('awesome prop')
      done()
    },
  })

  const TestComponent = enhance(ExampleComponent)
  mount(<TestComponent title="awesome prop" />)
})

test('lifecycle hook with props will receive them correctly', done => {
  const enhance = lifecycle({
    componentWillReceiveProps: props => nextProps => {
      expect(props.title).toBe('awesome prop')
      expect(nextProps.title).toBe('updated title')
      done()
    },
  })

  const TestComponent = enhance(ExampleComponent)
  const component = mount(<TestComponent title="awesome prop" />)
  component.setProps({ title: 'updated title' })
})
