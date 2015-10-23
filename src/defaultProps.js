import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';
import assign from 'lodash/object/assign';

const defaultProps = (props, BaseComponent) => {
  const DefaultProps = ownerProps => createElement(
      BaseComponent,
      assign({...ownerProps}, props, (oV, sV) => oV === undefined ? sV : oV)
    );

  DefaultProps.displayName = wrapDisplayName(BaseComponent, 'defaultProps');

  return DefaultProps;
};

export default curry(defaultProps);
