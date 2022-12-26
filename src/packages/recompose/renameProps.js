import omit from './utils/omit'
import pick from './utils/pick'
import mapProps from './mapProps'
import composeWithDisplayName from './composeWithDisplayName'

const { keys } = Object

const mapKeys = (obj, func) =>
  keys(obj).reduce((result, key) => {
    const val = obj[key]
    /* eslint-disable no-param-reassign */
    result[func(val, key)] = val
    /* eslint-enable no-param-reassign */
    return result
  }, {})

const renameProps = nameMap => {
  const hoc = mapProps(props => ({
    ...omit(props, keys(nameMap)),
    ...mapKeys(pick(props, keys(nameMap)), (_, oldName) => nameMap[oldName]),
  }))
  return composeWithDisplayName('renameProps', hoc)
}

export default renameProps
