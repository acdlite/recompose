import onlyUpdateForKeys from './onlyUpdateForKeys'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import getDisplayName from './getDisplayName'

const onlyUpdateForPropTypes = BaseComponent => {
  const propTypes = BaseComponent.propTypes

  if (process.env.NODE_ENV !== 'production') {
    if (!propTypes) {
      /* eslint-disable */
      console.error(
        'A component without any `propTypes` was passed to ' +
          '`onlyUpdateForPropTypes()`. Check the implementation of the ' +
          `component with display name "${getDisplayName(BaseComponent)}".`
      )
      /* eslint-enable */
    }
  }

  const propKeys = Object.keys(propTypes || {})
  const OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys)(BaseComponent)

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(
      wrapDisplayName(BaseComponent, 'onlyUpdateForPropTypes')
    )(OnlyUpdateForPropTypes)
  }
  return OnlyUpdateForPropTypes
}

export default onlyUpdateForPropTypes
