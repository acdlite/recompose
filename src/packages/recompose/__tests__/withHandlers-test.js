import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { withHandlers, withState, compose } from '../'

test('withHandlers passes handlers to base component', () => {
  let submittedFormValue
  const enhanceForm = compose(
    withState('value', 'updateValue', ''),
    withHandlers({
      onChange: props => event => {
        props.updateValue(event.target.value)
      },
      onSubmit: props => () => {
        submittedFormValue = props.value
      },
    })
  )

  const Form = enhanceForm(({ value, onChange, onSubmit }) =>
    <form onSubmit={onSubmit}>
      <label>
        Value
        <input type="text" value={value} onChange={onChange} />
      </label>
      <p>
        {value}
      </p>
    </form>
  )

  const wrapper = mount(<Form />)
  const input = wrapper.find('input')
  const output = wrapper.find('p')
  const form = wrapper.find('form')

  input.simulate('change', { target: { value: 'Yay' } })
  expect(output.text()).toBe('Yay')

  input.simulate('change', { target: { value: 'Yay!!' } })
  expect(output.text()).toBe('Yay!!')

  form.simulate('submit')
  expect(submittedFormValue).toBe('Yay!!')
})

test('withHandlers passes immutable handlers', () => {
  const enhance = withHandlers({
    handler: () => () => null,
  })
  const component = sinon.spy(() => null)
  const Div = enhance(component)

  const wrapper = mount(<Div />)
  wrapper.setProps({ foo: 'bar' })

  expect(component.calledTwice).toBe(true)
  expect(component.firstCall.args[0].handler).toBe(
    component.secondCall.args[0].handler
  )
})

test('withHandlers warns if handler is not a higher-order function', () => {
  const error = sinon.stub(console, 'error')

  const Button = withHandlers({
    onClick: () => {},
  })('button')

  const wrapper = mount(<Button />)
  const button = wrapper.find('button')

  expect(() => button.simulate('click')).toThrowError(/undefined/)

  expect(error.firstCall.args[0]).toBe(
    'withHandlers(): Expected a map of higher-order functions. Refer to ' +
      'the docs for more info.'
  )

  /* eslint-disable */
  console.error.restore()
  /* eslint-enable */
})

test('withHandlers allow handers to be a factory', () => {
  const enhance = withHandlers(initialProps => {
    let cache_

    return {
      handler: () => () => {
        if (cache_) {
          return cache_
        }
        cache_ = { ...initialProps }

        return cache_
      },
    }
  })

  const componentHandlers = []
  const componentHandlers2 = []

  const Component = enhance(({ handler }) => {
    componentHandlers.push(handler())
    return null
  })

  const Component2 = enhance(({ handler }) => {
    componentHandlers2.push(handler())
    return null
  })

  const wrapper = mount(<Component hello={'foo'} />)
  wrapper.setProps({ hello: 'bar' })
  expect(componentHandlers[0]).toBe(componentHandlers[1])

  // check that cache is not shared
  mount(<Component2 hello={'foo'} />)
  expect(componentHandlers[0]).toEqual(componentHandlers2[0])
  expect(componentHandlers[0]).not.toBe(componentHandlers2[0])
})
