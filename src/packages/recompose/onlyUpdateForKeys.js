import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import pick from './utils/pick'
import composeWithDisplayName from './composeWithDisplayName'

const onlyUpdateForKeys = propKeys => {
  const hoc = shouldUpdate(
    (props, nextProps) =>
      !shallowEqual(pick(nextProps, propKeys), pick(props, propKeys))
  )

  return composeWithDisplayName('onlyUpdateForKeys', hoc)
}

export default onlyUpdateForKeys
