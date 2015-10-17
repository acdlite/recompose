import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const withProps = (props, BaseComponent) => {
  const WithProps = ownerProps => <BaseComponent {...ownerProps} {...props} />;

  WithProps.displayName = wrapDisplayName(BaseComponent, 'withProps');

  return WithProps;
};

export default curry(withProps);
