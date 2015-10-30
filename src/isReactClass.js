const isReactClass = Component => (
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
);

export default isReactClass;
