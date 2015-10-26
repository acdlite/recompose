const isReferentiallyTransparentFunctionComponent = Component => (
  Component &&
  typeof Component !== 'string' &&
  !(Component.prototype && Component.prototype.render) &&
  !Component.defaultProps &&
  !Component.contextTypes &&
  !Component.propTypes
);

export default isReferentiallyTransparentFunctionComponent;
