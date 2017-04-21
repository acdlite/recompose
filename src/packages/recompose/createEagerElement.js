import createEagerElementUtil from './utils/createEagerElementUtil'
import isReferentiallyTransparentFunctionComponent
  from './isReferentiallyTransparentFunctionComponent'

const createEagerElement = (type, props, children) => {
  const isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(
    type
  )
  /* eslint-disable */
  const hasKey = props && props.hasOwnProperty('key')
  /* eslint-enable */
  return createEagerElementUtil(
    hasKey,
    isReferentiallyTransparent,
    type,
    props,
    children
  )
}

export default createEagerElement
