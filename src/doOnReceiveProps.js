import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';

const doOnReceiveProps = (callback, BaseComponent) => {
  const DoOnReceiveProps = props => {
    callback(props);
    return createElement(BaseComponent, props);
  };

  DoOnReceiveProps.displayName = wrapDisplayName(
    BaseComponent,
    'doOnReceiveProps'
  );

  return DoOnReceiveProps;
};

export default curry(doOnReceiveProps);
