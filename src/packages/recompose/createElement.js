import React from 'react'
import isReferentiallyTransparentFunctionComponent
  from './isReferentiallyTransparentFunctionComponent'

const _createElement = (isReferentiallyTransparent, Component, props, children) => {
  /* eslint-disable */
  const hasKey = props && props.hasOwnProperty('key')
  /* eslint-enable */

  if (!hasKey && isReferentiallyTransparent) {
    const component = Component
    if (children) {
      return component({ ...props, children })
    }
    return component(props)
  }

  if (children) {
    return <Component {...props}>{children}</Component>
  }

  return <Component {...props} />
}

export const curriedCreateElement = Component => {
  const isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(Component)
  return (p, c) => _createElement(isReferentiallyTransparent, Component, p, c)
}

const createElement = (Component, props, children) => {
  const isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(Component)
  return _createElement(isReferentiallyTransparent, Component, props, children)
}

export default createElement
