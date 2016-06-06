import createHelper from './createHelper'

const setStatic = (key, value) => BaseComponent => {
  BaseComponent[key] = value
  return BaseComponent
}

export default createHelper(setStatic, 'setStatic', false)
