import setStatic from './setStatic'
import createHelper from './createHelper'

const setPropTypes = propTypes =>
  setStatic('propTypes', propTypes)

export default createHelper(setPropTypes, 'setPropTypes', false)
