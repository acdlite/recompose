import shouldUpdate from './shouldUpdate';
import shallowEqual from './shallowEqual';
import wrapDisplayName from './wrapDisplayName';

const pure = BaseComponent => {
  const Pure = shouldUpdate(
    (props, nextProps) => !shallowEqual(props, nextProps)
  )(BaseComponent);

  Pure.displayName = wrapDisplayName(BaseComponent, 'pure');

  return Pure;
};

export default pure;
