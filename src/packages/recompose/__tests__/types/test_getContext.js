/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */
import React from 'react'
import { compose, withProps, getContext } from '../..'
// import PropTypes from 'prop-types'
import type { HOC } from '../..'

const PropTypes = {
  number: () => {},
  string: () => {},
}

type EnhancedCompProps = { eA: 1 }

const Comp = ({ eA }) =>
  <div>
    {(eA: number)}
    {
      // $ExpectError eA nor any nor string
      (eA: string)
    }
  </div>

const enhacer: HOC<*, EnhancedCompProps> = compose(
  getContext({
    // as an idea is to use a hack like this
    // so we can test all such types
    color: ((PropTypes.string: any): string),
    num: ((PropTypes.number: any): number),
  }),
  withProps(props => ({
    eA: (props.eA: number),
    color: (props.color: string),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
    // $ExpectError color nor any nor number
    colorErr: (props.color: number),
  })),
  withProps(props => ({
    // $ExpectError property not found
    err: props.iMNotExists,
  }))
)

const EnhancedComponent = enhacer(Comp)
