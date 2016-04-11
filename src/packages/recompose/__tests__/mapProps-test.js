import React from 'react'
import { expect } from 'chai'
import { mapProps, withState, compose } from 'recompose'
import { mount } from 'enzyme'

describe('mapProps()', () => {
  it('maps owner props to child props', () => {
    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      mapProps(({ strings, ...rest }) => ({
        ...rest,
        string: strings.join('')
      }))
    )('div')

    expect(StringConcat.displayName)
      .to.equal('withState(mapProps(div))')

    const div = mount(<StringConcat />).find('div')
    const { updateStrings } = div.props()

    expect(div.prop('string')).to.equal('doremi')

    updateStrings(strings => [...strings, 'fa'])
    expect(div.prop('string')).to.equal('doremifa')
  })
})
