const setStatic = (key, value) => BaseComponent => {
  /* eslint-disable no-param-reassign */
  BaseComponent[key] = value
  /* eslint-enable no-param-reassign */
  return BaseComponent
}

export default setStatic
