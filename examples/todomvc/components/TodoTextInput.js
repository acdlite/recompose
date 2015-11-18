import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import {
  compose,
  setPropTypes,
  mapProps,
  withState,
  onlyUpdateForPropTypes
} from 'recompose'

const TodoTextInput = props =>
  <input type="text" autoFocus="true" {...props} />

const todoTextInputApi = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newTodo: PropTypes.bool
}

export default compose(
  onlyUpdateForPropTypes,
  setPropTypes(todoTextInputApi),
  withState('text', 'setText', ({ text }) => text || ''),
  mapProps(({ setText, text, newTodo, onSave, editing, ...rest }) => ({
    ...rest,
    value: text,
    className: classnames({ edit: editing, 'new-todo': newTodo }),
    onBlur: e => { if (!newTodo) onSave(e.target.value) },
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      const returnPressed = e.which === 13
      if (returnPressed) onSave(e.target.value.trim())
      if (returnPressed && newTodo) setText('')
    }
  }))
)(TodoTextInput)
