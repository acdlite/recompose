/* globals $Exact, $PropertyType */
/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */
import React from 'react'
import {
  compose,
  withProps,
  flattenProp,
  renameProp,
  renameProps,
  withState,
} from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = {
  eA: number,
  obj: { objPropA: string, objPropB: number },
}

const Comp = ({ eA, objPropA }) =>
  <div>
    {(eA: number)}
    {(objPropA: string)}
    {
      // $ExpectError eA nor any nor string
      (eA: string)
    }
    {
      // $ExpectError eA nor any nor string
      (objPropA: number)
    }
  </div>

const Comp2 = ({ eA, objPropA }) =>
  <div>
    {/* hack to preview types */}
    {/* :: eA, objPropA */}
  </div>

const flattenEnhacer: HOC<*, EnhancedCompProps> = compose(
  (flattenProp('obj'): HOC<
    {
      ...$Exact<EnhancedCompProps>,
      ...$Exact<$PropertyType<EnhancedCompProps, 'obj'>>,
    },
    EnhancedCompProps
  >),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError
    eB: (props.eA: string),
  }))
)

const EnhancedComponent = flattenEnhacer(Comp)
const EnhancedComponent2 = flattenEnhacer(Comp2)

// renameEnhacer voodoo (you don't need it, use withProps instead)
const RenameComp = ({ eA, objNew, obj }) =>
  <div>
    {(eA: number)}

    {
      // objNew has a type we need
      (objNew.objPropA: string)
    }
    {
      // $ExpectError eA nor any nor string
      (eA: string)
    }
    {
      // $ExpectError eA nor any nor string
      (objNew.objPropA: number)
    }
    {
      // obj is null
      (obj: null)
    }
    {
      // $ExpectError eA nor any nor string
      (obj: string)
    }
  </div>

const renameEnhacer: HOC<*, EnhancedCompProps> = compose(
  (renameProp('obj', 'objNew'): HOC<
    {
      ...$Exact<EnhancedCompProps>,
      ...$Exact<{ obj: null }>,
      // $PropertyType does not work here
      ...$Exact<{ objNew: { objPropA: string, objPropB: number } }>,
    },
    EnhancedCompProps
  >),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError
    eB: (props.eA: string),
  }))
)

renameEnhacer(RenameComp)

const renamePropsEnhacer: HOC<*, EnhancedCompProps> = compose(
  (renameProps({ obj: 'objNew' }): HOC<
    {
      ...$Exact<EnhancedCompProps>,
      // --- repeat for every key ---
      ...$Exact<{ obj: null }>,
      // $PropertyType does not work here
      ...$Exact<{ objNew: { objPropA: string, objPropB: number } }>,
    },
    EnhancedCompProps
  >),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError
    eB: (props.eA: string),
  }))
)

// use withStateHandlers instead
const withStateEnhancer: HOC<*, EnhancedCompProps> = compose(
  (withState('a', 'setA', { hello: 'world' }): HOC<
    {
      ...$Exact<EnhancedCompProps>,
      ...$Exact<{ a: { hello: string }, setA: (a: { hello: string }) => void }>,
    },
    EnhancedCompProps
  >),
  withProps(props => ({
    eA: (props.eA: number),
    // $ExpectError
    eB: (props.eA: string),
  }))
)

// withReducer see withState above
// lifecycle see  withState above
