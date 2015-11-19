import expect from 'expect'
import React from 'react'
import createComponent from 'react-unit'
import TestUtils from 'react-addons-test-utils'
import TodoTextInput from '../../components/TodoTextInput'

function setup(propOverrides, shallow = false) {
  const props = Object.assign({
    onSave: expect.createSpy(),
    text: 'Use Redux',
    placeholder: 'What needs to be done?',
    editing: false,
    newTodo: false
  }, propOverrides)
  const renderer = null

  const output = createComponent(<TodoTextInput {...props} />)

  return { props, output }
}

describe('components', () => {
  describe('TodoTextInput', () => {
    it('should render correctly', () => {
      const { output } = setup()
      expect(output.props.placeholder).toEqual('What needs to be done?')
      expect(output.props.value).toEqual('Use Redux')
      expect(output.props.className).toEqual('')
    })

    it('should render correctly when editing=true', () => {
      const { output } = setup({ editing: true })
      expect(output.props.className).toEqual('edit')
    })

    it('should render correctly when newTodo=true', () => {
      const { output } = setup({ newTodo: true })
      expect(output.props.className).toEqual('new-todo')
    })

    it('should update value on change', () => {
      const { props } = setup()
      const output = TestUtils.renderIntoDocument(<TodoTextInput {...props} />)
      const input = TestUtils.findRenderedDOMComponentWithTag(output, 'input')
      expect(input.value).toEqual('Use Redux')
      TestUtils.Simulate.change(input, { target: { value: 'Use Radox' } })
      expect(input.value).toEqual('Use Radox')
    })

    it('should call onSave on return key press', () => {
      const { output, props } = setup()
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } })
      expect(props.onSave).toHaveBeenCalledWith('Use Redux')
    })

    it('should reset state on return key press if newTodo', () => {
      const { props } = setup({ newTodo: true })
      const output = TestUtils.renderIntoDocument(<TodoTextInput {...props} />)
      const input = TestUtils.findRenderedDOMComponentWithTag(output, 'input')
      TestUtils.Simulate.keyDown(input, { which: 13, target: { value: 'Use Redux' } })
      expect(input.value).toEqual('')
    })

    it('should call onSave on blur', () => {
      const { output, props } = setup()
      output.props.onBlur({ target: { value: 'Use Redux' } })
      expect(props.onSave).toHaveBeenCalledWith('Use Redux')
    })

    it('shouldnt call onSave on blur if newTodo', () => {
      const { output, props } = setup({ newTodo: true })
      output.props.onBlur({ target: { value: 'Use Redux' } })
      expect(props.onSave.calls.length).toBe(0)
    })
  })
})
