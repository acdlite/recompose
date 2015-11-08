import setStatic from './setStatic'
import createHelper from './createHelper'

const setDisplayName = setStatic('displayName')

export default createHelper(setDisplayName, 'setDisplayName', 2, false)
