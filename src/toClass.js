import { Component } from 'react';
import isReactClass from './isReactClass';
import compose from './compose';
import getDisplayName from './getDisplayName';
import setDisplayName from './setDisplayName';
import setContextTypes from './setContextTypes';
import setStatic from './setStatic';
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
    setStatic('defaultProps', baseComponent.defaultProps),
    setPropTypes(baseComponent.propTypes)
  )(ClassWrapper);
};

export default toClass;
