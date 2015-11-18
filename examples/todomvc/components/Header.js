import React, { PropTypes } from 'react'
import TodoTextInput from './TodoTextInput'
import {
  compose,
  setPropTypes,
  mapProps,
  onlyUpdateForPropTypes
} from 'recompose'

const Header = ({ handleSave }) =>
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={handleSave}
      placeholder="What needs to be done?" />
  </header>

export default compose(
  onlyUpdateForPropTypes,
  setPropTypes({ addTodo: PropTypes.func.isRequired }),
  mapProps(({ addTodo }) => ({
    handleSave: text => { if (text.length !== 0) addTodo(text) }
  }))
)(Header)
