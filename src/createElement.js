import React from 'react';
import isStatelessFunctionComponent from './isStatelessFunctionComponent';

const createElement = (Component, props) => (
  isStatelessFunctionComponent(Component)
    ? /* eslint-disable */ Component(props) /* eslint-enable */
    : <Component {...props} />
);

export default createElement;
