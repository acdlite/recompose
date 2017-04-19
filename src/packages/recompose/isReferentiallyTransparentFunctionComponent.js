import isClassComponent from './isClassComponent'

const isReferentiallyTransparentFunctionComponent = Component =>
  Boolean(
    typeof Component === 'function' &&
      !isClassComponent(Component) &&
      !Component.defaultProps &&
      !Component.contextTypes &&
      (process.env.NODE_ENV === 'production' || !Component.propTypes)
  )

export default isReferentiallyTransparentFunctionComponent
