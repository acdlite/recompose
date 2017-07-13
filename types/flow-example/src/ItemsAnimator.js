/* @flow */

import React from 'react'
import { css } from 'glamor'
import { compose, defaultProps, withHandlers, withProps } from 'recompose'
import Item from './Item'
import { TransitionMotion, spring } from 'react-motion'
// types
import type { HOC } from 'recompose'
import type { MousePosition } from './MouseDetector'

type ItemT = {
  id: number,
  title: string,
  color?: string,
}

// Props type of enhanced component
// It's the only props type we need to declare using supporting recompose enhancers
type ItemsAnimatorProps = {
  items: Array<ItemT>,
  config?: {
    size: number,
    hoverSize: number,
    hoverRotation: number,
    spacing: number,
  },
  mousePos: MousePosition,
}

// set existential * type for base component,
// flow is smart enough to infer base component and enhancers props types
const itemsAnimator = ({ styles, animStyles }) =>
  <TransitionMotion styles={animStyles}>
    {(
      interpolated: Array<{
        key: string,
        style: { x: number, y: number, size: number, borderK: number },
        data: { ...$Exact<ItemT>, hovered: boolean },
      }>
    ) =>
      <div {...styles.component}>
        {interpolated.map(({ key, data, style }) =>
          <Item
            key={key}
            color={data.color}
            title={data.title}
            size={style.size}
            hovered={data.hovered}
            x={style.x}
            y={style.y}
            borderK={style.borderK}
          />
        )}
      </div>}
  </TransitionMotion>

const enhanceItemsAnimator: HOC<*, ItemsAnimatorProps> = compose(
  /**
   * Defaults
   */
  defaultProps({
    styles: {
      component: css({
        position: 'absolute',
      }),
    },
    config: {
      size: 110,
      hoverSize: 150,
      hoverRotation: 2 * Math.PI,
      spacing: -10,
    },
    springConfig: {
      stiffness: 170,
      damping: 4,
      precision: 0.001,
    },
  }),
  /**
   * Function to calculate items positions size and hover
   * based on mouse position and previously hovered item
   */
  withHandlers(() => {
    let hoveredItemId_ = -1

    return {
      getItemsViewProps: ({ mousePos, items, config }) => () => {
        if (items.length === 0) return []

        const itemMaxWidth = config.size * Math.sqrt(2)
        const cIdx = (items.length - 1) / 2
        const itemsD = items
          .map((item, index) => ({
            ...item,
            size: hoveredItemId_ === item.id ? config.hoverSize : config.size,
            x: (index - cIdx) * (itemMaxWidth + config.spacing),
            y: 0,
          }))
          .map(item => ({
            ...item,
            x:
              hoveredItemId_ === item.id
                ? item.x + (mousePos.x - item.x) / 3
                : item.x,
            y:
              hoveredItemId_ === item.id
                ? item.y + (mousePos.y - item.y) / 3
                : item.y,
          }))
          .map(item => ({
            ...item,
            distance:
              Math.sqrt(
                Math.pow(mousePos.x - item.x, 2) + Math.pow(mousePos.y, 2)
              ) /
              (item.size * Math.sqrt(2) / 2),
          }))
        const nearestItem = [...itemsD].sort(
          (a, b) => a.distance - b.distance
        )[0]

        if (nearestItem && nearestItem.distance < 1) {
          hoveredItemId_ = nearestItem.id
          // console.log('nearestItem', nearestItem);
        } else {
          hoveredItemId_ = -1
        }

        return itemsD.map(item => ({
          ...item,
          hovered: item.id === hoveredItemId_,
        }))
      },
    }
  }),
  /**
   * Recalculate items positions, size, hover
   */
  withProps(({ getItemsViewProps }) => ({
    items: getItemsViewProps(),
  })),
  /**
   * Prepare data for react-motion
   */
  withProps(({ items, springConfig }) => ({
    animStyles: items.map(item => ({
      key: `${item.id}`,
      data: item,
      style: {
        x: spring(item.x, springConfig),
        y: spring(item.y, springConfig),
        size: spring(item.size, springConfig),
        borderK: spring(item.hovered ? 3 : 2, springConfig),
      },
    })),
  }))
)

export default enhanceItemsAnimator(itemsAnimator)
