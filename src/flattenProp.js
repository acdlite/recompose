import React from 'react';
import curry from 'lodash/function/curry';
import omit from 'lodash/object/omit';
import wrapDisplayName from './wrapDisplayName';

const flattenProp = (propName, BaseComponent) => {
  const FlattenProps = props => (
    <BaseComponent
      {...omit(props, propName)}
      {...props[propName]}
    />
  );

  FlattenProps.displayName = wrapDisplayName(BaseComponent, 'flattenProp');

  return FlattenProps;
};

export default curry(flattenProp);
