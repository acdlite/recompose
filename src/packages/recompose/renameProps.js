import omit from 'lodash/omit'
import pick from 'lodash/pick'
import mapKeys from 'lodash/mapKeys'
import mapProps from './mapProps'
import createHelper from './createHelper'

const { keys } = Object

const renameProps = nameMap =>
  mapProps(props => ({
    ...omit(props, keys(nameMap)),
    ...mapKeys(
      pick(props, keys(nameMap)),
      (_, oldName) => nameMap[oldName]
    )
  }))

export default createHelper(renameProps, 'renameProps')
