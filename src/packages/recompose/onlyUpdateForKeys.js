import pick from 'lodash/pick'
import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'

const onlyUpdateForKeys = propKeys =>
  shouldUpdate(
    (props, nextProps) => !shallowEqual(
      pick(nextProps, propKeys),
      pick(props, propKeys)
    )
  )

export default createHelper(onlyUpdateForKeys, 'onlyUpdateForKeys')
