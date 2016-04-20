import test from 'ava'
import React from 'react'
import { getDisplayName } from '../'

test('getDisplayName gets the display name of a React component', t => {
  class SomeComponent extends React.Component {
    render() {
      return <div />
    }
  }

  class SomeOtherComponent extends React.Component {
    static displayName = 'CustomDisplayName';
    render() {
      return <div />
    }
  }

  function YetAnotherComponent() {
    return <div />
  }

  t.is(getDisplayName(SomeComponent), 'SomeComponent')
  t.is(getDisplayName(SomeOtherComponent), 'CustomDisplayName')
  t.is(getDisplayName(YetAnotherComponent), 'YetAnotherComponent')
  t.is(getDisplayName(() => <div />), 'Component')
  t.is(getDisplayName('div'), 'div')
})
