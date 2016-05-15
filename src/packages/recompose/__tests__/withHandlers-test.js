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

test('withHandlers caches handlers properly', t => {
  const handlerCreationSpy = sinon.spy()
  const handlerCallSpy = sinon.spy()

  const enhance = withHandlers({
    handler: props => {
      handlerCreationSpy(props)
      return val => {
        handlerCallSpy(val)
      }
    }
  })
  const Div = enhance('div')

  const wrapper = mount(<Div foo="bar" />)
  const div = wrapper.find('div')
  const handler = div.prop('handler')

  // Don't create handler until it is called
  t.is(handlerCreationSpy.callCount, 0)
  t.is(handlerCallSpy.callCount, 0)

  handler(1)
  t.is(handlerCreationSpy.callCount, 1)
  t.deepEqual(handlerCreationSpy.args[0], [{ foo: 'bar' }])
  t.is(handlerCallSpy.callCount, 1)
  t.deepEqual(handlerCallSpy.args[0], [1])

  // Props haven't changed; should use cached handler
  handler(2)
  t.is(handlerCreationSpy.callCount, 1)
  t.is(handlerCallSpy.callCount, 2)
  t.deepEqual(handlerCallSpy.args[1], [2])

  wrapper.setProps({ foo: 'baz' })
  handler(3)
  // Props did change; handler should be recreated
  t.is(handlerCreationSpy.callCount, 2)
  t.deepEqual(handlerCreationSpy.args[1], [{ foo: 'baz' }])
  t.is(handlerCallSpy.callCount, 3)
  t.deepEqual(handlerCallSpy.args[2], [3])
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
