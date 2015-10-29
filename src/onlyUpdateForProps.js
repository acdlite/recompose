import onlyUpdateForKeys from 'onlyUpdateForKeys';

const onlyUpdateForProps = (BaseComponent) => {
  const propKeys = Object.keys(BaseComponent.propTypes || {});
  return onlyUpdateForKeys(propKeys, BaseComponent);
};

export default onlyUpdateForProps;
