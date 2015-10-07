import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const withProps = (props, BaseComponent) => (
  // TODO: Use stateless component once React TestUtils supports it
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'withProps');

    render() {
      return <BaseComponent {...this.props} {...props} />;
    }
  }
);

export default curry(withProps);
