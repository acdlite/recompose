import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const doOnReceiveProps = (callback, BaseComponent) => {
  const DoOnReceiveProps = props => {
    callback(props);
    return <BaseComponent {...props} />;
  };

  DoOnReceiveProps.displayName = wrapDisplayName(
    BaseComponent,
    'doOnReceiveProps'
  );

  return DoOnReceiveProps;
};

export default curry(doOnReceiveProps);
