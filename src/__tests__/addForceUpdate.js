import React from 'react';
import wrapDisplayName from '../wrapDisplayName';
import curry from 'lodash/function/curry';

const forceUpdate = (updaterName, BaseComponent) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent);
    forceUpdate = this.forceUpdate;

    render() {
      const props = {
        ...this.props,
        [updaterName]: this.forceUpdate
      };

      return <BaseComponent {...props} />;
    }
  }
);

export default curry(forceUpdate);
