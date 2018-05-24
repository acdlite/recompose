/* @flow */
import React from 'react'
import { compose, fromRenderProps } from '../..'

import type { HOC } from '../..'

const RenderPropsComponent1 = ({ children }) => children({ theme: 'dark' })
const RenderPropsComponent2 = ({ render }) => render({ i18n: 'zh-TW' })

type EnhancedCompProps = {||}

const Comp = ({ i18n, theme }) =>
  <div>
    {i18n}
    {theme}
    {
      // $ExpectError
      (i18n: number)
    }
    {
      // $ExpectError
      (theme: number)
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
  )
)

const EnhancedComponent = enhancer(Comp)
