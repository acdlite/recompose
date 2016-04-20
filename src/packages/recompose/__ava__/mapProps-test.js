import test from 'ava'
import React from 'react'
import { mapProps, withState, compose } from '../'
import { mount } from 'enzyme'

test('mapProps maps owner props to child props', t => {
  const StringConcat = compose(
    withState('strings', 'updateStrings', ['do', 're', 'mi']),
    mapProps(({ strings, ...rest }) => ({
      ...rest,
      string: strings.join('')
    }))
  )('div')

  t.is(StringConcat.displayName, 'withState(mapProps(div))')

  const div = mount(<StringConcat />).find('div')
  const { updateStrings } = div.props()

  t.is(div.prop('string'), 'doremi')

  updateStrings(strings => [...strings, 'fa'])
  t.is(div.prop('string'), 'doremifa')
})
