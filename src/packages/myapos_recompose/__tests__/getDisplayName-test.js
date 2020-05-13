import React from 'react'
import { getDisplayName } from '../'

test('getDisplayName gets the display name of a React component', () => {
  class SomeComponent extends React.Component {
    render() {
      return <div />
    }
  }

  class SomeOtherComponent extends React.Component {
    static displayName = 'CustomDisplayName'
    render() {
      return <div />
    }
  }

  function YetAnotherComponent() {
    return <div />
  }

  expect(getDisplayName(SomeComponent)).toBe('SomeComponent')
  expect(getDisplayName(SomeOtherComponent)).toBe('CustomDisplayName')
  expect(getDisplayName(YetAnotherComponent)).toBe('YetAnotherComponent')
  expect(getDisplayName(() => <div />)).toBe('Component')
  expect(getDisplayName('div')).toBe('div')
})
