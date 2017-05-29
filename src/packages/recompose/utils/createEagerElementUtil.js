import React from 'react'

const createEagerElementUtil = (
  hasKey,
  isReferentiallyTransparent,
  type,
  props,
  children
) => {
  if (!hasKey && isReferentiallyTransparent) {
    if (children) {
      return type({ ...props, children })
    }
    return type(props)
  }

  return React.createElement(
    type,
    props,
    children
  )
}

export default createEagerElementUtil
