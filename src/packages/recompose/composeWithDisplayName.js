import compose from './compose'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const composeWithDisplayName = (name, ...HOCs) => BaseComponent => {
  const needsNoDisplayName = process.env.NODE_ENV === 'production'

  const extendedHOCs = needsNoDisplayName
    ? HOCs
    : [setDisplayName(wrapDisplayName(BaseComponent, name)), ...HOCs]

  return compose(...extendedHOCs)(BaseComponent)
}

export default composeWithDisplayName
