import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const shouldUpdate = (test, BaseComponent) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'shouldUpdate');

    shouldComponentUpdate(nextProps) {
      return test(this.props, nextProps);
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }
);

export default curry(shouldUpdate);
