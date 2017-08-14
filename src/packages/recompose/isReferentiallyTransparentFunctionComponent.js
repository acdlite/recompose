import isClassComponent from './isClassComponent'

const isReferentiallyTransparentFunctionComponent = Component =>
  Boolean(
    process.env.NODE_ENV === 'production' &&
      typeof Component === 'function' &&
      !isClassComponent(Component) &&
      !Component.defaultProps &&
      !Component.contextTypes
  )

export default isReferentiallyTransparentFunctionComponent
