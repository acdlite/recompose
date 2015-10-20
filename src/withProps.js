import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';

const withProps = (props, BaseComponent) => {
  const WithProps = ownerProps => (
    createElement(BaseComponent, {
      ...ownerProps,
      ...props
    })
  );

  WithProps.displayName = wrapDisplayName(BaseComponent, 'withProps');

  return WithProps;
};

export default curry(withProps);
