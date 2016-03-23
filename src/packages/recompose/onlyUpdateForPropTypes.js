import onlyUpdateForKeys from './onlyUpdateForKeys'
import createHelper from './createHelper'

const onlyUpdateForPropTypes = BaseComponent => {
  const propTypes = BaseComponent.propTypes

  if (process.env.NODE_ENV !== 'production') {
    const getDisplayName = require('./getDisplayName').default
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

  return OnlyUpdateForPropTypes
}

export default createHelper(
  onlyUpdateForPropTypes,
  'onlyUpdateForPropTypes',
  true,
  true
)
