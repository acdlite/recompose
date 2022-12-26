import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import composeWithDisplayName from './composeWithDisplayName'

const pure = composeWithDisplayName('pure', BaseComponent => {
  const hoc = shouldUpdate(
    (props, nextProps) => !shallowEqual(props, nextProps)
  )

  return hoc(BaseComponent)
})

export default pure
