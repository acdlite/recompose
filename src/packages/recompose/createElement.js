import React from 'react'
import isReferentiallyTransparentFunctionComponent
  from './isReferentiallyTransparentFunctionComponent'

const createElement = (Component, props, children) => {
  /* eslint-disable */
  const hasKey = props && props.hasOwnProperty('key')
  /* eslint-enable */

  if (!hasKey && isReferentiallyTransparentFunctionComponent(Component)) {
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

export default createElement
