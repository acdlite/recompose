/* eslint-disable no-unused-vars, no-unused-expressions */
/* @flow */
import React from 'react'
import { compose, withProps } from 'recompose'

import type { HOC } from 'recompose'

type EnhancedCompProps = { a: string, b: number }

const Comp = ({ hello, b }) =>
  <div>
    {hello}
    {b}
    {
      // $ExpectError
      (b: number)
    }
    {
      // $ExpectError
      (hello: number)
    }
  </div>

const enhacer: HOC<*, EnhancedCompProps> = compose(
  withProps(({ a, b }) => ({
    hello: a,
    b: `${b}`,
  })),
  withProps(({ b, hello }) => ({
    hello: (hello: string),
    // $ExpectError (This type is incompatible with number)
    c: (b: number),
  })),
  withProps(props => ({
    a: (props.a: string),
    // $ExpectError property not found
    err: props.iMNotExists,
    // $ExpectError a not a number and not any
    aErr: (props.a: number),
  }))
)

const EnhancedComponent = enhacer(Comp)

;<EnhancedComponent a={'1'} b={1} />

// $ExpectError
;<EnhancedComponent a={'1'} b={'1'} />

// $ExpectError
;<EnhancedComponent a={'1'} />
