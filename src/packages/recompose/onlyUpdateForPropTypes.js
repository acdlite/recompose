import onlyUpdateForKeys from './onlyUpdateForKeys';
import wrapDisplayName from './wrapDisplayName';
import getDisplayName from './getDisplayName';

const onlyUpdateForPropTypes = (BaseComponent) => {
  const propTypes = BaseComponent.propTypes;

  if (process.env.NODE_ENV !== 'production') {
    if (!propTypes) {
      /* eslint-disable */
      console.warn(
        'A component without any `propTypes` was passed to ' +
        '`onlyUpdateForPropTypes()`. Check the implementation of the ' +
        `component with display name "${getDisplayName(BaseComponent)}".`
      );
      /* eslint-enable */
    }
  }

  const propKeys = Object.keys(propTypes || {});
  const OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys, BaseComponent);

  OnlyUpdateForPropTypes.displayName = wrapDisplayName(
    BaseComponent,
    'onlyUpdateForPropTypes'
  );

  return OnlyUpdateForPropTypes;
};

export default onlyUpdateForPropTypes;
