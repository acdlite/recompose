import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'
import {
  compose,
  setPropTypes,
  mapProps,
  withProps,
  renameProp
} from 'recompose'

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

const Footer = ({ todoCount, FilterLink, clearButton }) =>
  <footer className="footer">
    {todoCount}
    <ul className="filters">
      {[ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ].map(filter =>
        <li key={filter}>{FilterLink({ filter })}</li>
      )}
    </ul>
    {clearButton}
  </footer>

const itemWord = activeCount => activeCount === 1 ? 'item' : 'items'

const TodoCount = ({ activeCount }) =>
  <span className="todo-count">
    <strong>{activeCount || 'No'}</strong> {itemWord(activeCount)} left
  </span>

const FilterLink = ({ filter, selectedFilter, onShow }) =>
  <a className={classnames({ selected: filter === selectedFilter })}
    style={{ cursor: 'pointer' }}
    onClick={() => onShow(filter)}>
    {FILTER_TITLES[filter]}
  </a>

const ClearButton = ({ onClearCompleted }) =>
  <button className="clear-completed" onClick={onClearCompleted}>
    Clear completed
  </button>

const footerApi = {
  activeCount: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired
}

export default compose(
  setPropTypes(footerApi),
  renameProp('filter', 'selectedFilter'),
  mapProps(({ activeCount, selectedFilter, onShow, completedCount, onClearCompleted }) => ({
    todoCount: TodoCount({ activeCount }),
    FilterLink: withProps({ selectedFilter, onShow }, FilterLink),
    clearButton: completedCount > 0 ? ClearButton({ onClearCompleted }) : null
  }))
)(Footer)
