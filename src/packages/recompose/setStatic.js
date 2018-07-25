const setStatic = (key, value) => BaseComponent =>
  Object.assign({}, BaseComponent, { [key]: value })

export default setStatic
