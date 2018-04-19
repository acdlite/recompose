/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */

import React from 'react'
import { compose, withProps, hoistStatics } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = { a: number }

const A = ({ a, b }) =>
  <div>
    {a}
    {(b: string)}
    {
      // $ExpectError
      (a: string)
    }
    {
      // $ExpectError
      (b: number)
    }
  </div>

A.displayName = 'HELLO WORLD'

const enhacer: HOC<*, EnhancedCompProps> = compose(
  withProps(({ a }) => ({
    hello: a,
    b: `${a}`,
  }))
)

hoistStatics(enhacer)(A)

// I see no reason to test other utils, please add if you think otherwise
