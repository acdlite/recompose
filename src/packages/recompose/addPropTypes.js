import createHelper from './createHelper'

const addPropTypes = propTypes => BaseComponent => {
  BaseComponent.propTypes = {
    ...BaseComponent.propTypes,
    ...propTypes
  }
  return BaseComponent
}

export default createHelper(addPropTypes, 'addPropTypes', false)
