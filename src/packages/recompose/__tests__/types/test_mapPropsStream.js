/* globals */
/* eslint-disable no-unused-vars, no-unused-expressions, arrow-body-style */
/* @flow */
import React from 'react'
// import { Observable } from 'rxjs'
import { compose, mapProps, withProps, mapPropsStream } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = { eA: 1 }

const Observable = {
  of: (a: Object) => Object,
}

const Comp = ({ a }) =>
  <div>
    {(a: string)}
    {
      // $ExpectError
      (a: number)
    }
  </div>

const enhacer: HOC<*, EnhancedCompProps> = compose(
  (mapPropsStream((props$: Observable<EnhancedCompProps>) =>
    Observable.of({ a: 1, b: '1' })
  ): HOC<{ a: string, b: string }, *>),
  // If you need to to detect erros after a mapPropsStream HOC (the same for mapProps and some others)
  // you need to explicitly set Types for all HOCs below
  // but because of this https://github.com/facebook/flow/issues/4342
  withProps(props => ({
    a: (props.a: string),
    // $ExpectError but not
    e: Math.round(props.a),
  }))
)

enhacer(Comp)
