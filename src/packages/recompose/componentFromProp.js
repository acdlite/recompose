import wrapDisplayName from './wrapDisplayName';
import omit from 'lodash/object/omit';
import createElement from './createElement';

const componentFromProp = propName => {
  const ComponentFromProp = props => (
    createElement(props[propName], omit(props, propName))
  );

  ComponentFromProp.displayName = wrapDisplayName(
    propName,
    'componentFromProp'
  );

  return ComponentFromProp;
};

export default componentFromProp;
