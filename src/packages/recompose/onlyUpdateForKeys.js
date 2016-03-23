import pick from 'lodash/pick'
import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'

const onlyUpdateForKeys = propKeys => BaseComponent =>
  shouldUpdate(
    (props, nextProps) => !shallowEqual(
      pick(nextProps, propKeys),
      pick(props, propKeys)
    )
  )(BaseComponent)

export default createHelper(onlyUpdateForKeys, 'onlyUpdateForKeys')
