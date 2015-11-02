import { Component } from 'react';
import wrapDisplayName from './wrapDisplayName';

const toClass = (baseComponent) => (
  ( baseComponent.prototype && baseComponent.prototype.isReactComponent ) ? baseComponent :
  class extends Component {
    static displayName = wrapDisplayName(baseComponent, 'toClass');
    static propTypes = baseComponent.propTypes;
    static contextTypes = baseComponent.contextTypes;
    static defaultProps = baseComponent.defaultProps;

    render() {
      return baseComponent(this.props, this.context);
    }
  }
);

export default toClass;
