/* eslint-disable no-unused-vars, no-unused-expressions */
/* @flow */
import React from 'react'
import { compose, withProps } from '../..'

import type { HOC } from '../..'

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

const enhancer: HOC<*, EnhancedCompProps> = compose(
  withProps(({ a, b }) => ({
    hello: a,
    b: `${b}`,
  })),
  withProps(({ b, hello }) => ({
    hello: (hello: string),
    // $ExpectError (This type is incompatible with number)
    c: (b: number),
  })),
  // check non functional form of with props
  withProps({
    d: 'hi',
  }),
  withProps(props => ({
    a: (props.a: string),
    d: (props.d: string),
    // $ExpectError property not found
    err: props.iMNotExists,
    // $ExpectError a not a number and not any
    aErr: (props.a: number),
    // $ExpectError d not a number and not any
    dErr: (props.d: number),
  }))
)

const EnhancedComponent = enhancer(Comp)
;<EnhancedComponent a={'1'} b={1} />

// $ExpectError
;<EnhancedComponent a={'1'} b={'1'} />

// $ExpectError
;<EnhancedComponent a={'1'} />
