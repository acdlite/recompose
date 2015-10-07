import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const mapProps = (propsMapper, BaseComponent) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'mapProps');

    render() {
      return <BaseComponent {...propsMapper(this.props)} />;
    }
  }
);

export default curry(mapProps);
