import createEagerElementUtil from './utils/createEagerElementUtil'
import isReferentiallyTransparentFunctionComponent
  from './isReferentiallyTransparentFunctionComponent'

const createFactory = type => {
  const isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(
    type
  )
  return (p, c) =>
    createEagerElementUtil(false, isReferentiallyTransparent, type, p, c)
}

export default createFactory
