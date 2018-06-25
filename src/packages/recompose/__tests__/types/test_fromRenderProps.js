/* @flow */
import React from 'react'
import { compose, fromRenderProps } from '../..'

import type { HOC } from '../..'

const RenderPropsComponent1 = ({ children }) => children({ theme: 'dark' })
const RenderPropsComponent2 = ({ render }) => render({ i18n: 'zh-TW' })
const RenderPropsComponent3 = ({ children }) =>
  children({ theme: 'dark' }, { data: 'data' })

type EnhancedCompProps = {||}

const Comp = ({ i18n, theme, data }) =>
  <div>
    {i18n}
    {theme}
    {data}
    {
      // $ExpectError
      (i18n: number)
    }
    {
      // $ExpectError
      (theme: number)
    }
    {
      // $ExpectError
      (data: number)
    }
  </div>

const enhancer: HOC<*, EnhancedCompProps> = compose(
  fromRenderProps(RenderPropsComponent1, props => ({
    theme: props.theme,
    // $ExpectError property not found
    err: props.iMNotExists,
  })),
  fromRenderProps(
    RenderPropsComponent2,
    props => ({
      i18n: props.i18n,
      // $ExpectError property not found
      err: props.iMNotExists,
    }),
    'render'
  ),
  fromRenderProps(RenderPropsComponent3, (props, data) => ({
    theme: props.theme,
    data: data.data,
    // $ExpectError property not found
    err: data.iMNotExists,
  }))
)

const EnhancedComponent = enhancer(Comp)
