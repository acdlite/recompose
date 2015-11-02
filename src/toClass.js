import { Component } from 'react';
import getDisplayName from './getDisplayName';
import isClassComponent from './isClassComponent';

const toClass = baseComponent => {
  if (isClassComponent(baseComponent)) {
    return baseComponent;
  }

  return class extends Component {
    static displayName = getDisplayName(baseComponent);
    static propTypes = baseComponent.propTypes;
    static contextTypes = baseComponent.contextTypes;
    static defaultProps = baseComponent.defaultProps;

    render() {
      return baseComponent(this.props, this.context);
    }
  };
};

export default toClass;
