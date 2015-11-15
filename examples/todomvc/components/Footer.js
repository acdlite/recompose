import React, { PropTypes } from 'react'
import { withProps } from 'recompose'
import classnames from 'classnames'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

const Footer = props => {
  const {
    activeCount,
    completedCount,
    onClearCompleted,
    filter: selectedFilter,
    onShow
  } = props

  const CurriedFilterLink = withProps({ selectedFilter, onShow }, FilterLink)

  return (
    <footer className="footer">
      {TodoCount({ activeCount })}
      <ul className="filters">
        {[ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ].map(filter =>
          <li key={filter}>{CurriedFilterLink({ filter })}</li>
        )}
      </ul>
      {completedCount > 0 ? ClearButton({ onClearCompleted }) : null}
    </footer>
  )
}

const TodoCount = ({ activeCount }) => {
  const itemWord = activeCount === 1 ? 'item' : 'items'

  return (
    <span className="todo-count">
      <strong>{activeCount || 'No'}</strong> {itemWord} left
    </span>
  )
}

const FilterLink = ({ filter, selectedFilter, onShow }) => {
  const title = FILTER_TITLES[filter]
  const selected = filter === selectedFilter

  return (
    <a className={classnames({ selected })}
      style={{ cursor: 'pointer' }}
      onClick={() => onShow(filter)}>
      {title}
    </a>
  )
}

const ClearButton = ({ onClearCompleted }) =>
  <button className="clear-completed" onClick={onClearCompleted}>
    Clear completed
  </button>

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired
}

export default Footer
