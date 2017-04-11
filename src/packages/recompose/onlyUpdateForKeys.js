import shouldUpdate from './shouldUpdate'
import createHelper from './createHelper'
import shallowEqualForKeys from './utils/shallowEqualForKeys'

const onlyUpdateForKeys = propKeys =>
  shouldUpdate((props, nextProps) =>
    !shallowEqualForKeys(propKeys, nextProps, props))

export default createHelper(onlyUpdateForKeys, 'onlyUpdateForKeys')
