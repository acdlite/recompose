import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import createComponent from 'react-unit'
import Footer, { ClearButton } from '../../components/Footer'
import { SHOW_ALL, SHOW_ACTIVE } from '../../constants/TodoFilters'

function setup(propOverrides) {
  const props = Object.assign({
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: expect.createSpy(),
    onShow: expect.createSpy()
  }, propOverrides)

  const output = createComponent(<Footer {...props} />)

  return { props, output }
}

describe('components', () => {
  describe('Footer', () => {
    it('should render container', () => {
      const { output } = setup()
      expect(output.type).toBe('footer')
      expect(output.props.className).toBe('footer')
    })

    it('should display active count when 0', () => {
      const { output } = setup({ activeCount: 0 })
      const count = output.props.children[0]
      expect(count.texts.join('')).toBe('No items left')
    })

    it('should display active count when above 0', () => {
      const { output } = setup({ activeCount: 1 })
      const count = output.props.children[0]
      expect(count.texts.join('')).toBe('1 item left')
    })

    it('should render filters', () => {
      const { output } = setup()
      const filters = output.props.children[1]
      expect(filters.type).toBe('ul')
      expect(filters.props.className).toBe('filters')
      expect(filters.props.children.length).toBe(3)
      filters.props.children.forEach(function checkFilter(filter, i) {
        expect(filter.type).toBe('li')
        const a = filter.props.children
        expect(a.props.className).toBe(i === 0 ? 'selected' : '')
        expect(a.text).toBe({
          0: 'All',
          1: 'Active',
          2: 'Completed'
        }[i])
      })
    })

    it('should call onShow when a filter is clicked', () => {
      const { output, props } = setup()
      const filterLink = output.findByQuery('ul.filters li a')[1]
      filterLink.props.onClick({})
      expect(props.onShow).toHaveBeenCalledWith(SHOW_ACTIVE)
    })

    it('shouldnt show clear button when no completed todos', () => {
      const { output } = setup({ completedCount: 0 })
      const clear = output.props.children[2]
      expect(clear).toBe(undefined)
    })

    it('should render clear button when completed todos', () => {
      const { output } = setup({ completedCount: 1 })
      const clear = output.props.children[2]
      expect(clear.texts.join('')).toBe('Clear completed')
    })

    it('should call onClearCompleted on clear button click', () => {
      const { output, props } = setup({ completedCount: 1 })
      const clear = output.props.children[2]
      clear.props.onClick({})
      expect(props.onClearCompleted).toHaveBeenCalled()
    })
  })
})
