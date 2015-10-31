import { Component } from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';

const withContext = (
  childContextTypes,
  getChildContext,
  BaseComponent
) => (
  class extends Component {
    static displayName = wrapDisplayName(BaseComponent, 'withContext');
    static childContextTypes = childContextTypes;
    getChildContext = () => getChildContext(this.props);

    render() {
      return createElement(BaseComponent, this.props);
    }
  }
);

export default curry(withContext);
