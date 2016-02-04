import React from 'react'
import { expect } from 'chai'
import omit from 'lodash/omit'
import { mapProps, withState, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('mapProps()', () => {
  it('maps owner props to child props', () => {
    const spy = createSpy()
    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      mapProps(({ strings, ...rest }) => ({
        ...rest,
        string: strings.join('')
      })),
      spy
    )('div')

    expect(StringConcat.displayName)
      .to.equal('withState(mapProps(spy(div)))')

    renderIntoDocument(<StringConcat />)

    expect(omit(spy.getProps(), 'updateStrings')).to.eql({
      string: 'doremi'
    })

    spy.getProps().updateStrings(strings => [...strings, 'fa'])
    expect(omit(spy.getProps(), 'updateStrings')).to.eql({
      string: 'doremifa'
    })
  })
})
