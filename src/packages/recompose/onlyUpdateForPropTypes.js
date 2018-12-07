import onlyUpdateForKeys from './onlyUpdateForKeys'
import getDisplayName from './getDisplayName'
import composeWithDisplayName from './composeWithDisplayName'

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
  return composeWithDisplayName(
    'onlyUpdateForPropTypes',
    onlyUpdateForKeys(propKeys)
  )(BaseComponent)
}

export default onlyUpdateForPropTypes
