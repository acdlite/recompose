import isClassComponent from './isClassComponent'

const isReferentiallyTransparentFunctionComponent = Component =>
  Boolean(
    typeof Component === 'function' &&
      !isClassComponent(Component) &&
      !Component.propTypes &&
      !Component.defaultProps &&
      !Component.contextTypes
  )

export default isReferentiallyTransparentFunctionComponent
