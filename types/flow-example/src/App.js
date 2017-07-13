/* @flow */
import React from 'react'
import { css } from 'glamor'
import { compose, defaultProps } from 'recompose'
import MouseDetector from './MouseDetector'
import ItemsAnimator from './ItemsAnimator'
import type { HOC } from 'recompose'
import type { MousePosition } from './MouseDetector'

// Enhanced component props type
type AppProps = {}

const app = ({ styles, items }) =>
  <div {...styles.app}>
    <div {...styles.header}>
      <a href={'https://github.com/acdlite/recompose/types/flow-example'}>
        Coolmenu
      </a>{' '}
      <span>recompose flow typed example</span>
    </div>
    <div {...styles.content}>
      <MouseDetector>
        {({ x, y }: MousePosition) =>
          <ItemsAnimator items={items} spacing={-10} mousePos={{ x, y }} />}
      </MouseDetector>
    </div>
    <div {...styles.footer}>
      <span>created by</span>{' '}
      <a href={'https://github.com/istarkov'}>Ivan Starkov</a>
    </div>
  </div>

const appEnhancer: HOC<*, AppProps> = compose(
  defaultProps({
    items: [
      { id: 1, title: 'Recompose', color: '#FFB02E' },
      { id: 2, title: 'Has', color: '#FFB02E' },
      { id: 3, title: 'Flow', color: '#FFB02E' },
      { id: 4, title: 'Support', color: '#FFB02E' },
      { id: 5, title: 'Now!', color: '#FFB02E' },
    ],
    styles: {
      app: css({
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      }),
      header: css({
        padding: '1rem 5rem',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        fontSize: '1.2rem',
        backgroundColor: 'rgba(0,0,0,0.05)',
        '>SPAN': {
          fontSize: '0.8rem',
        },
        '>A': {
          color: '#CCCCFF',
          textDecoration: 'none',
        },
      }),
      content: css({
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }),
      footer: css({
        padding: '0.5rem 5rem',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(0,0,0,0.05)',
        textAlign: 'right',
        '>SPAN': {
          fontSize: '0.8rem',
        },
        '>A': {
          color: '#CCCCFF',
          textDecoration: 'none',
        },
      }),
    },
  })
)

export default appEnhancer(app)
