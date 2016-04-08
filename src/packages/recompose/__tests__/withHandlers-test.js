import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import { withHandlers, withState, compose } from 'recompose'

describe('withHandlers()', () => {
  it('passes immutable handlers to base component', () => {
    const enhanceForm = compose(
      withState('value', 'updateValue', ''),
      withHandlers({
        onChange: props => event => {
          props.updateValue(event.target.value)
        }
      })
    )

    const Form = enhanceForm(
      ({ value, onChange }) =>
        <form>
          <label>Value
            <input type="text" value={value} onChange={onChange} />
          </label>
          <p>{value}</p>
        </form>
    )

    const wrapper = mount(<Form />)
    const input = wrapper.find('input')
    const output = wrapper.find('p')

    input.simulate('change', { target: { value: 'Yay' } })
    expect(output.text()).to.equal('Yay')

    input.simulate('change', { target: { value: 'Yay!!' } })
    expect(output.text()).to.equal('Yay!!')
  })

  it('warns if handler is not a higher-order function', () => {
    const error = sinon.stub(console, 'error')

    const Button = withHandlers({
      onClick: () => {}
    })('button')

    const wrapper = mount(<Button foo="bar" />)
    const button = wrapper.find('button')

    expect(() => button.simulate('click')).to.throw(
      `Cannot read property 'apply' of undefined`
    )

    expect(error.firstCall.args[0]).to.equal(
      'withHandlers(): Expected a map of higher-order functions. Refer to ' +
      'the docs for more info.'
    )

    /* eslint-disable */
    console.error.restore()
    /* eslint-enable */
  })
})
