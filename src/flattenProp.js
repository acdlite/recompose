import React from 'react';
import curry from 'lodash/function/curry';
import omit from 'lodash/object/omit';
import wrapDisplayName from './wrapDisplayName';

const flattenProp = (propName, BaseComponent) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'flattenProp');

    render() {
      return (
        <BaseComponent
          {...omit(this.props, propName)}
          {...this.props[propName]}
        />
      );
    }
  }
);

export default curry(flattenProp);
