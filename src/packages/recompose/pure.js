import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'

const pure = shouldUpdate((props, nextProps) => !shallowEqual(props, nextProps))

export default createHelper(pure, 'pure', true, true)
