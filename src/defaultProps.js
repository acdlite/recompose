import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const defaultProps = (props, BaseComponent) => (
  // TODO: Use stateless component once React TestUtils supports it
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'defaultProps');

    render() {
      return <BaseComponent {...props} {...this.props} />;
    }
  }
);

export default curry(defaultProps);
