import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'



// import {
//   compose,
//   setPropTypes,
//   mapProps,
//   withProps,
//   renameProp,
//   withState
// } from 'recompose'

// const TodoTextInput = { editing, newTodo, ...rest } =>
//   <input
//     className={classnames({ edit: editing, 'new-todo': newTodo })}
//     type="text"
//     autoFocus="true"
//     {...rest} />

// todoTextInputApi = {
//   onSave: PropTypes.func.isRequired,
//   text: PropTypes.string,
//   placeholder: PropTypes.string,
//   editing: PropTypes.bool,
//   newTodo: PropTypes.bool
// }

// export default compose(
//   setPropTypes(todoTextInputApi),
//   withState('text', 'setText', ({ text }) => text || ''),
//   mapProps(({ setText, text, newTodo, onSave, ...rest }) => ({
//     value: text,
//     onBlur: e => { if (!newTodo) onSave(e.target.value) },
//     onChange: e => setText(e.target.value),
//     onKeyDown: e => {
//       if (e.which === 13) {
//         onSave(e.target.value.trim())
//         if (newTodo) {
//           setText('')
//         }
//       }
//     },
//     ...rest
//   }))
// )(TodoTextInput)




class TodoTextInput extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.text || ''
    }
  }

  handleSubmit(e) {
    const text = e.target.value.trim()
    if (e.which === 13) {
      this.props.onSave(text)
      if (this.props.newTodo) {
        this.setState({ text: '' })
      }
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleBlur(e) {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value)
    }
  }

  render() {
    return (
      <input className={
        classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)} />
    )
  }
}

TodoTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newTodo: PropTypes.bool
}

export default TodoTextInput
