import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import pick from './utils/pick'

const onlyUpdateForKeys = propKeys => {
  const hoc = shouldUpdate(
    (props, nextProps) =>
      !shallowEqual(pick(nextProps, propKeys), pick(props, propKeys))
  )

  if (process.env.NODE_ENV !== 'production') {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeys'))(
        hoc(BaseComponent)
      )
  }
  return hoc
}

export default onlyUpdateForKeys
