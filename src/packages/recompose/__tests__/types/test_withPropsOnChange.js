/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */
import React from 'react'
import { compose, withProps, withPropsOnChange } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = { eA: 1 }

const Comp = ({ hello, eA }) =>
  <div>
    {(hello: string)}
    {(eA: number)}
    {
      // $ExpectError eA nor any nor string
      (eA: string)
    }
    {
      // $ExpectError hello nor any nor number
      (hello: number)
    }
  </div>

const enhacer: HOC<*, EnhancedCompProps> = compose(
  withPropsOnChange(['eA'], ({ eA }) => ({
    hello: `${eA}`,
  })),
  withProps(props => ({
    hello: (props.hello: string),
    eA: (props.eA: number),
    // $ExpectError hello nor any nor number
    helloErr: (props.hello: number),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
  })),
  withProps(props => ({
    // $ExpectError property not found
    err: props.iMNotExists,
  }))
)

const enhacerFn: HOC<*, EnhancedCompProps> = compose(
  withPropsOnChange(
    (props, nextProps) => {
      ;(props.eA: number)
      ;(nextProps.eA: number)
      // $ExpectError eA nor any nor string
      ;(props.eA: string)
      // $ExpectError eA nor any nor string
      ;(nextProps.eA: string)
      return props.eA === props.eA
    },
    ({ eA }) => ({
      hello: `${eA}`,
    })
  ),
  withProps(props => ({
    hello: (props.hello: string),
    eA: (props.eA: number),
    // $ExpectError hello nor any nor number
    helloErr: (props.hello: number),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
  }))
)

const enhacerErr: HOC<*, EnhancedCompProps> = compose(
  // $ExpectError property property `eB` not found
  withPropsOnChange(['eA', 'eB'], ({ eA }) => ({
    hello: `${eA}`,
  }))
)

const enhacerFnErr: HOC<*, EnhancedCompProps> = compose(
  withPropsOnChange(
    (props, nextProps) => {
      // $ExpectError boolean
      return 1
    },
    ({ eA }) => ({
      hello: `${eA}`,
    })
  ),
  withProps(props => ({
    hello: (props.hello: string),
    eA: (props.eA: number),
  }))
)

const EnhancedComponent = enhacer(Comp)
