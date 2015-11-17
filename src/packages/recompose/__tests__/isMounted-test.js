import React from 'react'
import { expect } from 'chai'
import { isMounted, withState, compose } from 'recompose'
import createSpy from 'recompose/createSpy'

import { renderIntoDocument } from 'react-addons-test-utils'

describe('isMounted()', () => {

  it('Works', () => {
    const spy = createSpy()
    const Component = compose(
      isMounted('isMounted'),
      spy
    )('div')

    const unmounterSpy = createSpy()
    const Unmounter = compose(
      withState('mounted', 'setMounted', true),
      unmounterSpy,
    )(props => props.mounted ? <Component/> : <div /> )

    renderIntoDocument(<Unmounter />)

    const props = spy.getProps()

    expect(props.isMounted()).to.eql(true)

    unmounterSpy.getProps().setMounted(false)

    expect(props.isMounted()).to.eql(false)
  })
})
