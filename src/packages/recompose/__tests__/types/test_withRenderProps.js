/* @flow */

import * as React from 'react'
import { compose, withProps, withRenderProps, withHandlers } from '../..'
import type { HOC } from '../..'

const enhance: HOC<*, {| +x: number |}> = compose(
  withProps(props => ({
    y: props.x + 1,
  })),
  withHandlers({
    sayHello: ({ y }) => () => {
      console.log('Hello', y)
    },
  })
)

const WithProps = withRenderProps(enhance)

const Comp = () =>
  <WithProps x={1}>
    {({ y, sayHello }) =>
      <div onClick={() => sayHello()}>
        {y}
      </div>}
  </WithProps>

const Comp2 = () =>
  // $ExpectError
  <WithProps x={'1'}>
    {({ y, sayHello }) =>
      <div onClick={() => sayHello()}>
        {y}
      </div>}
  </WithProps>

// $ExpectError cannot create `WithProps` element because property `children` is missing in props
const Comp2 = () => <WithProps x={1} />

const Comp3 = () =>
  <WithProps x={1}>
    {({ y, sayHello }) =>
      <div
        onClick={() => {
          ;(sayHello: () => void)

          // $ExpectError
          ;(sayHello: number)
          sayHello()
        }}
      >
        {(y: number)}
        {
          // $ExpectError
          (y: string)
        }
      </div>}
  </WithProps>
