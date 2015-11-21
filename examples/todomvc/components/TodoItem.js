import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import {
  compose,
  setPropTypes,
  mapProps,
  withState,
  onlyUpdateForPropTypes
} from 'recompose'

const TodoItem = ({ classNames, ...rest }) =>
  <li className={classNames}>{Element(rest)}</li>

const Element = props => {
  const {
    onSave,
    editing,
    todo,
    completeTodo,
    deleteTodo,
    setEditing
  } = props

  if (editing) {
    return <TodoTextInput editing text={todo.text} onSave={onSave} />
  }

  return (
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        onChange={() => completeTodo(todo.id)} />
      <label onDoubleClick={() => setEditing(true)}>
        {todo.text}
      </label>
      <button className="destroy" onClick={() => deleteTodo(todo.id)} />
    </div>
  )
}

const todoItemApi = {
  todo: PropTypes.object.isRequired,
  editTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired
}

export default compose(
  onlyUpdateForPropTypes,
  setPropTypes(todoItemApi),
  withState('editing', 'setEditing', false),
  mapProps(props => ({
    ...props,
    onSave: text => {
      if (text.length === 0) {
        props.deleteTodo(props.todo.id)
      }
      else {
        props.editTodo(props.todo.id, text)
      }
      props.setEditing(false)
    },
    classNames: classnames({
      completed: props.todo.completed,
      editing: props.editing
    })
  }))
)(TodoItem)






// class TodoItem extends Component {
//   constructor(props, context) {
//     super(props, context)
//     this.state = {
//       editing: false
//     }
//   }

//   handleDoubleClick() {
//     this.setState({ editing: true })
//   }

//   handleSave(id, text) {
//     if (text.length === 0) {
//       this.props.deleteTodo(id)
//     } else {
//       this.props.editTodo(id, text)
//     }
//     this.setState({ editing: false })
//   }

//   render() {
//     const { todo, completeTodo, deleteTodo } = this.props

//     let element
//     if (this.state.editing) {
//       element = (
//         <TodoTextInput text={todo.text}
//                        editing={this.state.editing}
//                        onSave={(text) => this.handleSave(todo.id, text)} />
//       )
//     } else {
//       element = (
//         <div className="view">
//           <input className="toggle"
//                  type="checkbox"
//                  checked={todo.completed}
//                  onChange={() => completeTodo(todo.id)} />
//           <label onDoubleClick={this.handleDoubleClick.bind(this)}>
//             {todo.text}
//           </label>
//           <button className="destroy"
//                   onClick={() => deleteTodo(todo.id)} />
//         </div>
//       )
//     }

//     return (
//       <li className={classnames({
//         completed: todo.completed,
//         editing: this.state.editing
//       })}>
//         {element}
//       </li>
//     )
//   }
// }

// TodoItem.propTypes = {
//   todo: PropTypes.object.isRequired,
//   editTodo: PropTypes.func.isRequired,
//   deleteTodo: PropTypes.func.isRequired,
//   completeTodo: PropTypes.func.isRequired
// }

// export default TodoItem
