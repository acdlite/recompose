import omit from './utils/omit'
import mapProps from './mapProps'
import createHelper from './createHelper'

const mapKeys = (obj, func) =>
  Object.keys(obj).reduce((result, key) => {
    const val = obj[key]
    /* eslint-disable no-param-reassign */
    result[func(val, key)] = val
    /* eslint-enable no-param-reassign */
    return result
  }, {})

const pick = (obj, keys) => {
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

const renameProps = nameMap => {
  const keys = Object.keys(nameMap)
  return mapProps(props => ({
    ...omit(props, keys),
    ...mapKeys(pick(props, keys), (_, oldName) => nameMap[oldName])
  }))
}

export default createHelper(renameProps, 'renameProps')
