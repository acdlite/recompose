import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import { withHandlers, withState, compose } from '../'
import sinon from 'sinon'

test('withHandlers passes immutable handlers to base component', t => {
  let submittedFormValue
  const enhanceForm = compose(
    withState('value', 'updateValue', ''),
    withHandlers({
      onChange: props => event => {
        props.updateValue(event.target.value)
      },
      onSubmit: props => () => {
        submittedFormValue = props.value
      }
    })
  )

  const Form = enhanceForm(
    ({ value, onChange, onSubmit }) =>
      <form onSubmit={onSubmit}>
        <label>Value
          <input type="text" value={value} onChange={onChange} />
        </label>
        <p>{value}</p>
      </form>
  )

  const wrapper = mount(<Form />)
  const input = wrapper.find('input')
  const output = wrapper.find('p')
  const form = wrapper.find('form')

  input.simulate('change', { target: { value: 'Yay' } })
  t.is(output.text(), 'Yay')

  input.simulate('change', { target: { value: 'Yay!!' } })
  t.is(output.text(), 'Yay!!')

  form.simulate('submit')
  t.is(submittedFormValue, 'Yay!!')
})

test.serial('withHandlers warns if handler is not a higher-order function', t => {
  const error = sinon.stub(console, 'error')

  const Button = withHandlers({
    onClick: () => {}
  })('button')

  const wrapper = mount(<Button foo="bar" />)
  const button = wrapper.find('button')

  t.throws(() => button.simulate('click'), /undefined/)

  t.is(
    error.firstCall.args[0],
    'withHandlers(): Expected a map of higher-order functions. Refer to ' +
    'the docs for more info.'
  )

  /* eslint-disable */
  console.error.restore()
  /* eslint-enable */
})
