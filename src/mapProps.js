import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const mapProps = (propsMapper, BaseComponent) => {
  const MapProps = props => <BaseComponent {...propsMapper(props)} />;

  MapProps.displayName = wrapDisplayName(BaseComponent, 'mapProps');

  return MapProps;
};

export default curry(mapProps);
