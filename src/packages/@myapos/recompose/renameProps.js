import omit from './utils/omit'
import pick from './utils/pick'
import mapProps from './mapProps'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

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
  if (process.env.NODE_ENV !== 'production') {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, 'renameProps'))(
        hoc(BaseComponent)
      )
  }
  return hoc
}

export default renameProps
