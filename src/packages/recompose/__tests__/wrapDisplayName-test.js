import test from 'ava'
import React from 'react'
import { wrapDisplayName } from 'recompose'

test('wrapDisplayName wraps the display name of a React component with the name of an HoC, Relay-style', t => {
  class SomeComponent extends React.Component {
    render() {
      return <div />
    }
  }

  t.is(wrapDisplayName(SomeComponent, 'someHoC'), 'someHoC(SomeComponent)')
})
