import setStatic from './setStatic'
import createHelper from './createHelper'

const setDisplayName = displayName =>
  setStatic('displayName', displayName)

export default createHelper(setDisplayName, 'setDisplayName', false)
