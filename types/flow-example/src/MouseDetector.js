/* @flow */
import React from 'react'
import {
  compose,
  defaultProps,
  withHandlers,
  withProps,
  withStateHandlers,
} from 'recompose'
import { css } from 'glamor'
import type { HOC } from 'recompose'

// shared type
export type MousePosition = { x: number, y: number }

// Props type of enhanced component
// It's the only props type we need to declare using supporting recompose enhancers
type EnhancedMouseDetectorProps = {
  styles?: { component: Object },
  children: (mousePos: MousePosition) => ?React$Element<any>,
}

// base component
const mouseDetector = ({ styles, registerChild, children, mousePos }) =>
  <div ref={registerChild} {...styles.component}>
    {children(mousePos)}
  </div>

// set existential * type for base component i.e. mouseDetector,
// flow is smart enough to infer base component and enhancers props types
const enhanceMouseDetector: HOC<*, EnhancedMouseDetectorProps> = compose(
  /**
   * styles can be overwritten by parent component
   */
  defaultProps({
    styles: {
      component: css({
        backgroundColor: 'red',
        position: 'relative',
        width: 0,
        height: 0,
      }),
    },
  }),
  /**
   * Component state and state handlers needed to calculate mouse position
   * relative to current component
   */
  withStateHandlers(
    // flow is smart enough to detect state type
    { mousePos: { x: Infinity, y: Infinity }, offset: { x: 0, y: 0 } },
    {
      // flow infers state and props types but
      // we need to declare type for handler argument i.e. x,y here
      // otherwise type inference will not work for following enhancers
      setMousePosition: (state, props) => (x: number, y: number) => ({
        mousePos: { x, y },
      }),
      // the same as above, we need to declare arg type
      setInitialOffsetYAndScrollY: () => (x: number, y: number) => ({
        offset: {
          x,
          y,
        },
      }),
    }
  ),
  /**
   * withHandlers hack to intercept document events
   */
  withHandlers(() => {
    let resizeHandler_
    let mouseMoveHandler_

    return {
      // hovering on state updater functions gives you a type like
      // Void<SomeFunctionType>, Void type helper transforms function result type to void
      // See libdef and tests, I haven't found more prettier solution
      registerChild: ({ setInitialOffsetYAndScrollY, setMousePosition }) => (
        ref: ?HTMLDivElement
      ) => {
        // I have no idea why window has any type so this is not covered
        const window: Node = document.defaultView

        if (ref) {
          // like ComponentDidMount if ref is not null
          resizeHandler_ = () => {
            if (!ref) return
            const refRect = ref.getBoundingClientRect()

            const docRect =
              document.documentElement &&
              document.documentElement.getBoundingClientRect()

            if (docRect) {
              // documentElement can be null so flow asks to check;
              const offsetX = refRect.left - docRect.left
              const offsetY = refRect.top - docRect.top

              setInitialOffsetYAndScrollY(offsetX, offsetY)
            }
          }

          // call initially to update state
          resizeHandler_()

          mouseMoveHandler_ = (evt: MouseEvent) =>
            setMousePosition(evt.pageX, evt.pageY)

          window.addEventListener('resize', resizeHandler_)
          document.addEventListener('mousemove', mouseMoveHandler_)
        } else {
          // like ComponentWillUnmount if ref is null

          if (resizeHandler_)
            window.removeEventListener('resize', resizeHandler_)
          if (mouseMoveHandler_)
            document.removeEventListener('mousemove', mouseMoveHandler_)

          resizeHandler_ = undefined
          mouseMoveHandler_ = undefined
        }
      },
    }
  }),
  /**
   * convert mouse coordinates into local
  */
  withProps(({ mousePos, offset }) => ({
    mousePos: {
      x: mousePos.x - offset.x,
      y: mousePos.y - offset.y,
    },
  }))
)

export default enhanceMouseDetector(mouseDetector)
