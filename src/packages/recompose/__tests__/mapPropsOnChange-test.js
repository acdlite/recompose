import React from 'react'
import { expect } from 'chai'
import { mapPropsOnChange, withState, flattenProp, compose } from 'recompose'
import { mount } from 'enzyme'

describe('mapPropsOnChange()', () => {
  it('maps subset of owner props to child props', () => {
    const mapSpy = sinon.spy()
    const StringConcat = compose(
      withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
      flattenProp('strings'),
      mapPropsOnChange(
        ['a', 'b'],
        ({ a, b }) => {
          mapSpy()
          return {
            foobar: a + b
          }
        }
      )
    )('div')

    expect(StringConcat.displayName).to.equal(
      'withState(flattenProp(mapPropsOnChange(div)))'
    )

    const div = mount(<StringConcat />).find('div')
    const { updateStrings } = div.props()

    expect(div.prop('foobar')).to.equal('ab')
    expect(mapSpy.callCount).to.equal(1)

    // Does not re-map for non-dependent prop updates
    updateStrings(strings => ({ ...strings, c: 'baz' }))
    expect(div.prop('foobar')).to.equal('ab')
    expect(mapSpy.callCount).to.equal(1)

    updateStrings(strings => ({ ...strings, a: 'foo', 'b': 'bar' }))
    expect(div.prop('foobar')).to.equal('foobar')
    expect(mapSpy.callCount).to.equal(2)
  })
})
