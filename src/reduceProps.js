import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';

const reduceProps = (reduce, initialState, BaseComponent) => {
  let state = initialState;

  const ReduceProps = props => {
    state = reduce(state, props);
    return createElement(BaseComponent, state);
  };

  ReduceProps.displayName = wrapDisplayName(BaseComponent, 'reduceProps');

  return ReduceProps;
};

export default curry(reduceProps);
