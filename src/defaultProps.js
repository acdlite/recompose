import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const defaultProps = (props, BaseComponent) => {
  const DefaultProps = ownerProps => (
    <BaseComponent {...ownerProps} />
  );

  DefaultProps.defaultProps = props;
  DefaultProps.displayName = wrapDisplayName(BaseComponent, 'defaultProps');

  return DefaultProps;
};

export default curry(defaultProps);
