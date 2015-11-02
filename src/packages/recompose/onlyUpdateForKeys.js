import pick from 'lodash/object/pick';
import curry from 'lodash/function/curry';
import shouldUpdate from './shouldUpdate';
import shallowEqual from './shallowEqual';
import wrapDisplayName from './wrapDisplayName';

const onlyUpdateForKeys = (propKeys, BaseComponent) => {
  const OnlyUpdateForKeys = shouldUpdate(
    (props, nextProps) => !shallowEqual(
      pick(nextProps, propKeys),
      pick(props, propKeys)
    ),
    BaseComponent
  );

  OnlyUpdateForKeys.displayName = wrapDisplayName(
    BaseComponent,
    'onlyUpdateForKeys'
  );

  return OnlyUpdateForKeys;
};

export default curry(onlyUpdateForKeys);
