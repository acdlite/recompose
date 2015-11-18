import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Footer, { ClearButton } from '../../components/Footer'
import { SHOW_ALL, SHOW_ACTIVE } from '../../constants/TodoFilters'

// TODO: for easier testing: https://github.com/pzavolinsky/react-unit

function setup(propOverrides) {
  const props = Object.assign({
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: expect.createSpy(),
    onShow: expect.createSpy()
  }, propOverrides)

  const output = TestUtils.renderIntoDocument(<Footer {...props} />)
  const footer = TestUtils.findRenderedDOMComponentWithTag(output, 'footer')
  const filters = TestUtils.findRenderedDOMComponentWithClass(output, 'filters')
  const count = TestUtils.findRenderedDOMComponentWithClass(output, 'todo-count')
  const listItems = TestUtils.scryRenderedDOMComponentsWithTag(output, 'li')

  return {
    props,
    output,
    footer,
    filters,
    count,
    listItems
  }
}

function getTextContent(elem) {
  const children = Array.isArray(elem.props.children) ?
    elem.props.children : [ elem.props.children ]

  return children.reduce(function concatText(out, child) {
    // Children are either elements or text strings
    return out + (child.props ? getTextContent(child) : child)
  }, '')
}

describe('components', () => {
  describe('Footer', () => {
    it('should display active count when 0', () => {
      const { count } = setup({ activeCount: 0 })
      expect(getTextContent(count)).toBe('No items left')
    })

    it('should display active count when above 0', () => {
      const { count } = setup({ activeCount: 1 })
      expect(getTextContent(count)).toBe('1 item left')
    })

    it.only('should render filters', () => {
      const { listItems } = setup()
      expect(listItems.length).toBe(3)
      listItems.forEach(function checkFilter(filter, i) {
        console.log(filter)
        const a = TestUtils.findRenderedDOMComponentWithTag(filter, 'a')
        expect(a.props.className).toBe(i === 0 ? 'selected' : '')
        expect(a.props.children).toBe({
          0: 'All',
          1: 'Active',
          2: 'Completed'
        }[i])
      })
    })

    it('should call onShow when a filter is clicked', () => {
      const { listItems, props } = setup()
      const filterLink = listItems[1].props.children
      filterLink.props.onClick({})
      expect(props.onShow).toHaveBeenCalledWith(SHOW_ACTIVE)
    })

    it('shouldnt show clear button when no completed todos', () => {
      const { output } = setup({ completedCount: 0 })
      const clear = TestUtils.scryRenderedDOMComponentsWithClass(output, 'clear-completed')[0]
      expect(clear).toBe(undefined)
    })

    it('should render clear button when completed todos', () => {
      const { output } = setup({ completedCount: 1 })
      const clear = TestUtils.findRenderedDOMComponentWithClass(output, 'clear-completed')
      expect(clear.props.children).toBe('Clear completed')
    })

    it('should call onClearCompleted on clear button click', () => {
      const { output, props } = setup({ completedCount: 1 })
      const clear = TestUtils.findRenderedDOMComponentWithClass(output, 'clear-completed')
      clear.props.onClick({})
      expect(props.onClearCompleted).toHaveBeenCalled()
    })
  })
})
