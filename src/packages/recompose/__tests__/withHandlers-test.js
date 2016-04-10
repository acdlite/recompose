import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import { withHandlers, withState, compose } from 'recompose'

describe('withHandlers()', () => {
  it('passes immutable handlers to base component', () => {
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
    expect(output.text()).to.equal('Yay')

    input.simulate('change', { target: { value: 'Yay!!' } })
    expect(output.text()).to.equal('Yay!!')

    form.simulate('submit')
    expect(submittedFormValue).to.equal('Yay!!')
  })

  it('warns if handler is not a higher-order function', () => {
    const error = sinon.stub(console, 'error')

    const Button = withHandlers({
      onClick: () => {}
    })('button')

    const wrapper = mount(<Button foo="bar" />)
    const button = wrapper.find('button')

    expect(() => button.simulate('click')).to.throw(/undefined/)

    expect(error.firstCall.args[0]).to.equal(
      'withHandlers(): Expected a map of higher-order functions. Refer to ' +
      'the docs for more info.'
    )

    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })
})
