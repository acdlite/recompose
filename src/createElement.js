import React from 'react';
import isReferentiallyTransparentFunctionComponent
  from './isReferentiallyTransparentFunctionComponent';

const createElement = (Component, props) => (
  isReferentiallyTransparentFunctionComponent(Component)
    ? /* eslint-disable */ Component(props) /* eslint-enable */
    : <Component {...props} />
);

export default createElement;
