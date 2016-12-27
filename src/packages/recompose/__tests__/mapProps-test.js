import test from 'ava'
import React from 'react'
import { mapProps, withState, compose } from '../'
import { mount } from 'enzyme'
import sinon from 'sinon'

test('mapProps maps owner props to child props', t => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const StringConcat = compose(
    withState('strings', 'updateStrings', ['do', 're', 'mi']),
    mapProps(({ strings, ...rest }) => ({
      ...rest,
      string: strings.join('')
    }))
  )(component)

  t.is(StringConcat.displayName, 'withState(mapProps(component))')

  mount(<StringConcat />)
  const { updateStrings } = component.firstCall.args[0]
  updateStrings(strings => [...strings, 'fa'])

  t.is(component.firstCall.args[0].string, 'doremi')
  t.is(component.secondCall.args[0].string, 'doremifa')
})
