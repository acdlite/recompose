/* eslint-disable no-unused-vars, no-unused-expressions */
/* @flow */

import React from 'react'
import { compose, withProps, withStateUpdaters } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = {
  initialCounter: number,
}

const enhancer: HOC<*, EnhancedCompProps> = compose(
  withStateUpdaters(
    { value: 'Hello', letIt: 'be', obj: ({}: { [key: string]: string }) },
    {
      // we need to set argument type so inference will work good
      setValue: (value: string) => ({
        value,
      }),
      changeValue: ({ i, j }: { i: number, j: string }, k: number) => (
        state,
        props
      ) => ({
        value: `world again ${i} ${j}`,
      }),
      inform: () => null,
    }
  ),
  // here props itself will not be infered without explicit handler args types
  withProps(props => ({
    hi: (props.value: string),
    ic: (props.initialCounter: number),
    cc: (props.obj.a: string),
    // $ExpectError value not a number or any
    ehi: (props.value: number),
    // $ExpectError not a number
    cn: (props.obj.a: number),
    // $ExpectError property not found (to detect that props is not any)
    err: props.iMNotExists,
    // $ExpectError initialCounter not any nor string
    icErr: (props.initialCounter: string),
  }))
)

const enhancerFuncInit: HOC<*, EnhancedCompProps> = compose(
  withStateUpdaters(
    props => ({
      counter: props.initialCounter,
    }),
    {
      // it's better to set argument type with named props, easier to find an error
      // if you call it with wrong arguments
      incCounter: ({ value }: { value: number }) => ({ counter }) => ({
        counter: counter + value,
      }),
    }
  ),
  withProps(props => ({
    // check that result is void
    iVal: (props.incCounter({ value: 1 }): void),
    // $ExpectError check that incCounter is not any
    iVal2: (props.incCounter({ value: 1 }): number),
    // $ExpectError property not found
    err: props.iMNotExists,
  }))
)

const BaseComponent = ({ hi, changeValue, setValue }) => (
  <div
    onClick={() => {
      // check that supports few arguments
      const x = changeValue({ i: 1, j: '1' }, 1)

      setValue('ww')
      // Check that result is void
      ;(x: void)

      // $ExpectError check that x is not any
      ;(x: {})

      // Check hi
      ;(hi: string)

      // $ExpectError check that hi is not any
      ;(hi: number)
    }}
  >
    {hi}
  </div>
)

const EnhancedComponent = enhancer(BaseComponent)
;<EnhancedComponent initialCounter={0} />

// Without $Exact<State> this will cause error
const enhancer3: HOC<*, EnhancedCompProps> = compose(
  withStateUpdaters(
    ({
      mapA2B: {},
    }: { mapA2B: { [key: string]: string } }),
    {}
  ),
  withProps(props => ({
    // check that result is void
    iVal: props.mapA2B.c,
  }))
)
