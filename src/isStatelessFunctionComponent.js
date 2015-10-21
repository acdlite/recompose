const isStatelessFunctionComponent = Component => (
  Component &&
  typeof Component !== 'string' &&
  !(Component.prototype && Component.prototype.render) &&
  !Component.contextTypes
);

export default isStatelessFunctionComponent;
