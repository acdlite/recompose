import { Component } from 'react';
import isReactClass from './isReactClass';
import compose from './compose';
import getDisplayName from './getDisplayName';
import setDisplayName from './setDisplayName';
import setContextTypes from './setContextTypes';
import setDefaultProps from './setDefaultProps';
import setPropTypes from './setPropTypes';

const toClass = baseComponent => {
  if (isReactClass(baseComponent)) {
    return baseComponent;
  }

  const ClassWrapper = class extends Component {
    render() {
      return baseComponent(this.props, this.context);
    }
  };

  return compose(
    setDisplayName(getDisplayName(baseComponent)),
    setContextTypes(baseComponent.contextTypes),
    setDefaultProps(baseComponent.defaultProps),
    setPropTypes(baseComponent.propTypes)
  )(ClassWrapper);
};

export default toClass;
