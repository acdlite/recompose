import React from 'react'
import expect from 'expect'
import { nest, setDisplayName, toClass } from 'recompose'

import { createRenderer } from 'react-addons-test-utils'

describe('nest()', () => {
  it('nests components from outer to inner', () => {
    const renderer = createRenderer()

    const A = setDisplayName('A', toClass('div'))
    const B = setDisplayName('B', toClass('div'))
    const C = setDisplayName('C', toClass('div'))

    const Nest = nest(A, B, C)

    expect(Nest.displayName).toEqual('nest(A, B, C)')

    renderer.render(
      <Nest pass="through">
        Child
      </Nest>
    )

    expect(renderer.getRenderOutput()).toEqualJSX(
      <A pass="through">
        <B pass="through">
          <C pass="through">
            Child
          </C>
        </B>
      </A>
    )
  })
})
