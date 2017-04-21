import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'
import pick from './utils/pick'

const onlyUpdateForKeys = propKeys =>
  shouldUpdate(
    (props, nextProps) =>
      !shallowEqual(pick(nextProps, propKeys), pick(props, propKeys))
  )

export default createHelper(onlyUpdateForKeys, 'onlyUpdateForKeys')
