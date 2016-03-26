import React from 'react'
import { expect } from 'chai'
import omit from 'lodash/omit'
import { mapPropsOnChange, withState, flattenProp, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('mapPropsOnChange()', () => {
  it('maps subset of owner props to child props', () => {
    const mapSpy = sinon.spy()
    const spy = createSpy()
    const StringConcat = compose(
      withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
      flattenProp('strings'),
      mapPropsOnChange(
        ['a', 'b'],
        ({ a, b }) => {
          mapSpy()
          return {
            foobar: a + b,
            d: 'new',
          }
        }
      ),
      spy
    )('div')

    expect(StringConcat.displayName).to.equal(
      'withState(flattenProp(mapPropsOnChange(spy(div))))'
    )

    renderIntoDocument(<StringConcat />)

    expect(omit(spy.getProps(), ['updateStrings'])).to.eql({
      a: 'a',
      b: 'b',
      c: 'c',
      foobar: 'ab',
      d: 'new'
    })
    expect(mapSpy.callCount).to.equal(1)

    spy.getProps().updateStrings(strings => ({ ...strings, c: 'baz' }))
    // Does not re-map for non-dependent prop updates
    expect(mapSpy.callCount).to.equal(1)

    expect(omit(spy.getProps(), ['updateStrings', 'updateFoobar'])).to.eql({
      a: 'a',
      b: 'b',
      c: 'baz',
      foobar: 'ab',
      d: 'new'
    })

    spy.getProps().updateStrings(strings => ({ ...strings, a: 'foo', 'b': 'bar', d: 'old' }))
    expect(omit(spy.getProps(), ['updateStrings', 'updateFoobar'])).to.eql({
      a: 'foo',
      b: 'bar',
      c: 'baz',
      foobar: 'foobar',
      d: 'new'
    })
    expect(mapSpy.callCount).to.equal(2)
  })
})
