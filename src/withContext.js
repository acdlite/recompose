import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const withContext = (
  childContextTypes,
  getChildContext,
  BaseComponent
) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'withContext');
    static childContextTypes = childContextTypes;
    getChildContext = () => getChildContext(this.props);

    render() {
      return <BaseComponent {...this.props} />;
    }
  }
);

export default curry(withContext);
