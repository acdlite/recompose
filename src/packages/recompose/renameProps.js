import omit from 'lodash/object/omit'
import pick from 'lodash/object/pick'
import mapKeys from 'lodash/object/mapKeys'
import mapProps from './mapProps'
import createHelper from './createHelper'

const { keys } = Object

const renameProps = (nameMap, BaseComponent) =>
  mapProps(props => ({
    ...omit(props, keys(nameMap)),
    ...mapKeys(
      pick(props, keys(nameMap)),
      (_, oldName) => nameMap[oldName]
    )
  }), BaseComponent)

export default createHelper(renameProps, 'renameProps')
