import React from 'react'
import isReferentiallyTransparentFunctionComponent
  from './isReferentiallyTransparentFunctionComponent'

const _createElement = (hasKey, isReferentiallyTransparent, Component, props, children) => {
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

export const internalCreateElement = Component => {
  const isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(Component)
  return (p, c) => _createElement(false, isReferentiallyTransparent, Component, p, c)
}

const createElement = (Component, props, children) => {
  const isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(Component)
  /* eslint-disable */
  const hasKey = props && props.hasOwnProperty('key')
  /* eslint-enable */
  return _createElement(hasKey, isReferentiallyTransparent, Component, props, children)
}

export default createElement
