import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const getContext = (contextTypes, BaseComponent) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'getContext');
    static contextTypes = contextTypes;

    render() {
      return <BaseComponent {...this.props} {...this.context} />;
    }
  }
);

export default curry(getContext);
