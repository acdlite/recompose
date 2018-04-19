/* @flow */

import * as React from 'react'
import { compose, withProps } from '../..'
import type { HOC } from '../..'

function mapProps<BaseProps: {}, EnhancedProps>(
  mapperFn: EnhancedProps => BaseProps
): (React.ComponentType<BaseProps>) => React.ComponentType<EnhancedProps> {
  return Component => props => <Component {...mapperFn(props)} />
}

type EnhancedProps = { hello: string }

const baseComponent = ({ hello, len }) =>
  <div>
    {(hello: string)}

    {
      // $ExpectError
      (hello: number)
    }

    {(len: number)}

    {
      // $ExpectError
      (len: string)
    }
  </div>

const enhancer: HOC<*, EnhancedProps> = compose(
  mapProps(({ hello }) => ({
    hello: `${hello} world`,
    len: hello.length,
  })),
  withProps(props => ({
    helloAndLen: `${props.hello} ${props.len}`,
    // $ExpectError
    lE: (props.len: string),
  }))
)

enhancer(baseComponent)
