import expect from 'expect'
import React from 'react'
import createComponent from 'react-unit'
import {
  renderIntoDocument,
  Simulate,
  findRenderedDOMComponentWithTag
} from 'react-addons-test-utils'
import TodoItem from '../../components/TodoItem'
import TodoTextInput from '../../components/TodoTextInput'

function setup( editing = false ) {
  const props = {
    todo: {
      id: 0,
      text: 'Use Redux',
      completed: false
    },
    editTodo: expect.createSpy(),
    deleteTodo: expect.createSpy(),
    completeTodo: expect.createSpy()
  }

  const instance = <TodoItem {...props} />
  const output = createComponent(instance)

  // if (editing) {
  //   const label = output.props.children.props.children[1]
  //   label.props.onDoubleClick({})
  //   output = renderer.getRenderOutput()
  // }

  return { props, output, instance }
}

describe('components', () => {
  describe('TodoItem', () => {
    it('has a proper initial render', () => {
      const { output } = setup()

      expect(output.type).toBe('li')
      expect(output.props.className).toBe('')

      const div = output.props.children

      expect(div.type).toBe('div')
      expect(div.props.className).toBe('view')

      const [ input, label, button ] = div.props.children

      expect(input.type).toBe('input')
      expect(input.props.checked).toBe(false)

      expect(label.type).toBe('label')
      expect(label.text).toBe('Use Redux')

      expect(button.type).toBe('button')
      expect(button.props.className).toBe('destroy')
    })

    it('input onChange should call completeTodo', () => {
      const { output, props } = setup()
      const input = output.props.children.props.children[0]
      input.props.onChange({})
      expect(props.completeTodo).toHaveBeenCalledWith(0)
    })

    it('button onClick should call deleteTodo', () => {
      const { output, props } = setup()
      const button = output.props.children.props.children[2]
      button.props.onClick({})
      expect(props.deleteTodo).toHaveBeenCalledWith(0)
    })

    xit('label onDoubleClick should put component in edit state', () => {
      // TODO: `Simulate.doubleClick` is raising
      // "Error: Invariant Violation: processUpdates(): Unable to find child 0 of element."
      // probably because the component disappears on the state change while
      // the test utils are still operating on the component
      // TODO: this problem does not crop up when running app in Chrome (and
      // presumably other browsers), so try running these tests with Karma
      // and Chrome instead of using jsdom.  This will help narrow down the
      // list of possible sources of the problem: jsdom, test utils, or the
      // way the test is written
      const { instance } = setup()
      const output = renderIntoDocument(instance)
      const label = findRenderedDOMComponentWithTag(output, 'label')
      Simulate.doubleClick(label)
      // find `li` and assert 'editing' class
      // expect(output.type).toBe('li')
      // expect(output.props.className).toBe('editing')
    })

    xit('edit state render', () => {
      // TODO: same as above
      const { output } = setup(true)

      expect(output.type).toBe('li')
      expect(output.props.className).toBe('editing')

      const input = output.props.children
      expect(input.type).toBe(TodoTextInput)
      expect(input.props.text).toBe('Use Redux')
      expect(input.props.editing).toBe(true)
    })

    xit('TodoTextInput onSave should call editTodo', () => {
      // TODO: same as above
      const { output, props } = setup(true)
      output.props.children.props.onSave('Use Redux')
      expect(props.editTodo).toHaveBeenCalledWith(0, 'Use Redux')
    })

    xit('TodoTextInput onSave should call deleteTodo if text is empty', () => {
      // TODO: same as above
      const { output, props } = setup(true)
      output.props.children.props.onSave('')
      expect(props.deleteTodo).toHaveBeenCalledWith(0)
    })

    xit('TodoTextInput onSave should exit component from edit state', () => {
      // TODO: same as above
      const { output, renderer } = setup(true)
      output.props.children.props.onSave('Use Redux')
      const updated = renderer.getRenderOutput()
      expect(updated.type).toBe('li')
      expect(updated.props.className).toBe('')
    })
  })
})
