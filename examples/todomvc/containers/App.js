import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions/todos'
import { compose, setPropTypes, onlyUpdateForPropTypes } from 'recompose'

const App = ({ todos, actions }) =>
  <div>
    <Header addTodo={actions.addTodo} />
    <MainSection todos={todos} actions={actions} />
  </div>

const mapStateToProps = ({ todos }) => ({ todos })

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
})

const appApi = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForPropTypes,
  setPropTypes(appApi)
)(App)
