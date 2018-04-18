/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */
import React from 'react'
import {
  compose,
  withProps,
  setStatic,
  setPropTypes,
  setDisplayName,
} from '../..'
// import PropTypes from 'prop-types'
import type { HOC } from '../..'

const PropTypes = {
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
  setStatic('hello', 'world'),
  setPropTypes({
    a: PropTypes.string,
  }),
  setDisplayName('hello'),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
  })),
  withProps(props => ({
    // $ExpectError property not found
    err: props.iMNotExists,
  }))
)

// $ExpectError name is string
setDisplayName(1)

// $ExpectError propTypes is object
setPropTypes(1)

// $ExpectError name is string
setStatic(1, 'world')

const EnhancedComponent = enhacer(Comp)
