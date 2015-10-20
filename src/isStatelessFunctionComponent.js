const isStatelessFunctionComponent = Component => (
  typeof Component !== 'string' &&
  !('prototype' in Component)
);

export default isStatelessFunctionComponent;
