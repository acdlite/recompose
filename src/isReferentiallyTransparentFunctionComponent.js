const isReferentiallyTransparentFunctionComponent = Component => (
  Component &&
  typeof Component !== 'string' &&
  !(Component.prototype && Component.prototype.render) &&
  !Component.defaultProps &&
  !Component.contextTypes
);

export default isReferentiallyTransparentFunctionComponent;
