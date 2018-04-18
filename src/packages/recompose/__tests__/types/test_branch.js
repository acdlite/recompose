/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */
import React from 'react'
import {
  compose,
  withProps,
  branch,
  renderNothing,
  renderComponent,
  onlyUpdateForKeys,
} from '../..'

import type { HOC } from '../..'

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
  branch(({ eA }) => eA === 1, renderNothing),
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

const enhacerLoading: HOC<*, EnhancedCompProps> = compose(
  branch(({ eA }) => eA === 1, renderComponent(p => <div>Loading</div>)),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
  }))
)

// can work with onlyUpdateForKeys
const enhacerUpdating: HOC<*, EnhancedCompProps> = compose(
  branch(({ eA }) => eA === 1, onlyUpdateForKeys(['eA'])),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
  }))
)

// can infer withProps type
const enhacerWithProps: HOC<*, EnhancedCompProps> = compose(
  branch(({ eA }) => eA === 1, withProps(props => ({ x: 1 }))),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
  }))
)

// can infer compose types
const enhacerWithCompose: HOC<*, EnhancedCompProps> = compose(
  branch(
    ({ eA }) => eA === 1,
    compose(
      withProps(props => {
        // $ExpectError eA nor any nor string
        ;(props.eA: string)

        return { x: 1 }
      }),
      withProps(props => ({ y: 2 }))
    )
  ),
  withProps(props => ({
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
    // $ExpectError x nor any nor string
    xErr: (props.x: string),
    // $ExpectError y nor any nor string
    yErr: (props.y: string),
  }))
)

const enhacerLeftRight: HOC<*, EnhancedCompProps> = compose(
  branch(
    ({ eA }) => eA === 1,
    renderComponent(p => <div>A</div>),
    renderComponent(p => <div>B</div>)
  ),
  withProps(props => ({
    // $ExpectError eA nor any nor string
    eAErr: (props.eA: string),
    // $ExpectError x nor any nor string
    xErr: (props.x: string),
    // $ExpectError y nor any nor string
    yErr: (props.y: string),
  }))
)

/*
Wrong types of left right, this will cause an infinite recursion

const enhacerLeftRight2: HOC<*, EnhancedCompProps> = compose(
  branch(
    ({ eA }) => eA === 1,
    renderComponent(p => <div>A</div>),
    withProps(props => ({ y: 2 }))
  )
);
*/

const EnhancedComponent = enhacer(Comp)
