import curry from 'lodash/function/curry';

const setStatic = (key, value, BaseComponent) => {
  BaseComponent[key] = value;
  return BaseComponent;
};

export default curry(setStatic);
