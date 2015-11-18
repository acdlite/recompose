import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Header from '../../components/Header'
import TodoTextInput from '../../components/TodoTextInput'
import createComponent from 'react-unit'

describe('components', () => {
  describe('Header', () => {
    function setup() {
      const props = {
        addTodo: expect.createSpy()
      }

      const output = createComponent(<Header {...props} />)

      return { props, output }
    }

    it('should render correctly', () => {
      const { output } = setup()

      expect(output.type).toBe('header')

      const [ h1, input ] = output.props.children

      expect(h1.type).toBe('h1')
      expect(h1.text).toBe('todos')

      const Input = input.originalComponentInstance

      expect(Input.type).toBe(TodoTextInput)
      expect(Input.props.newTodo).toBe(true)
      expect(Input.props.placeholder).toBe('What needs to be done?')
    })

    it('should call addTodo if length of text is greater than 0', () => {
      const { output, props } = setup()
      const [ _, input ] = output.props.children
      const Input = input.originalComponentInstance

      Input.props.onSave('')
      expect(props.addTodo.calls.length).toBe(0)

      Input.props.onSave('Use Redux')
      expect(props.addTodo.calls.length).toBe(1)
    })

    it('should map props correctly', () => {
      const { output } = setup()
      const Input = output.props.children[1].originalComponentInstance
      expect(Input.props.onSave.name).toBe('handleSave')
    })
  })
})
