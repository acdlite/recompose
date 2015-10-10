import React from 'react';
import omit from 'lodash/object/omit';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const defaultProps = (props, BaseComponent) => (
  // TODO: Use stateless component once React TestUtils supports it
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'defaultProps');

    render() {
      const nextProps = omit(
        this.props,
        (value, key) => (key in props) && (value === undefined)
      );

      return <BaseComponent {...props} {...nextProps} />;
    }
  }
);

export default curry(defaultProps);
