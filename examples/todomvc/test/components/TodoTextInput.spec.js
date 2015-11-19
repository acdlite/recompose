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
      const { output } = setup()
      const input = output.findByQuery('input')[0]
      input.onChange({ target: { value: 'Use Radox' } })
      const updated = output.renderNew()
      expect(updated.props.value).toEqual('Use Radox')
    })

    it('should call onSave on return key press', () => {
      const { output, props } = setup()
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } })
      expect(props.onSave).toHaveBeenCalledWith('Use Redux')
    })

    it.only('should reset state on return key press if newTodo', () => {
      // TODO: see react-unit docs on `renderNew`
      const { output } = setup({ newTodo: true })
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } })
      console.log(output.renderNew().props.onKeyDown.toString())
      const updated = output.renderNew()
      expect(updated.props.value).toEqual('')
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
