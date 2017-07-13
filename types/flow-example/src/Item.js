/* @flow */

import React from 'react'
import { css } from 'glamor'
import { compose, defaultProps, withProps, withPropsOnChange } from 'recompose'
import type { HOC } from 'recompose'

// Props type of enhanced component
// It's the only props type we need to declare using supporting recompose enhancers
type ItemProps = {
  title: string,
  styles?: {
    component: Object,
    title: Object,
    border: Object,
  },
  size?: number,
  x?: number,
  y?: number,
  borderCount?: number,
  hovered?: boolean,
  color?: string,
  textColor?: string,
  hoveredColor?: string,
}

const item = ({ title, componentDynamicStyle, styles, borders }) =>
  <div {...styles.component} style={componentDynamicStyle}>
    <div {...styles.title}>
      {title}
    </div>
    {borders.map(({ style, id }) =>
      <div key={id} style={style} {...styles.border} />
    )}
  </div>

// set existential * type for base component,
// flow is smart enough to infer base component and enhancers props types
const enhanceItem: HOC<*, ItemProps> = compose(
  defaultProps({
    title: '',
    styles: {
      component: css({
        position: 'absolute',
        display: 'flex',
      }),
      title: css({
        margin: 'auto',
        color: 'deeppink',
        fontWeight: '600',
      }),
      border: css({
        position: 'absolute',
        border: '1px solid deeppink',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 5,
        cursor: 'pointer',
      }),
    },
    size: 100,
    x: 0,
    y: 0,
    borderCount: 9,
    borderK: 2,
    hovered: false,
    color: '#CCCCFF',
    textColor: 'white',
    hoveredColor: 'white',
  }),
  /**
   * calculate css based on hovered prop
   * better to use withProps as glamour uses class caching
   * BTW it's flow example
   */
  withPropsOnChange(
    ['hovered', 'styles', 'color', 'hoveredColor', 'textColor'],
    ({ hovered, styles, color, textColor, hoveredColor }) => ({
      styles: {
        ...styles,
        title: hovered
          ? css(styles.title, { color: hoveredColor })
          : css(styles.title, { color: textColor }),

        border: hovered
          ? css(styles.border, { borderColor: hoveredColor })
          : css(styles.border, { borderColor: color }),
      },
    })
  ),
  /**
   * calculate component dynamic style
   */
  withProps(({ size, x, y, hovered }) => ({
    componentDynamicStyle: {
      width: size,
      height: size,
      left: x - size / 2,
      top: y - size / 2,
      zIndex: hovered ? 1 : 0,
    },
  })),
  /**
   * generate borders props
   */
  withProps(({ borderCount, borderK }) => ({
    borders: Array(borderCount).fill(0).map((_, index) => ({
      id: index,
      style: {
        transform: `rotate(${borderK * Math.PI * index / borderCount}rad)`,
        borderRadius: 5,
      },
    })),
  }))
)

export default enhanceItem(item)
