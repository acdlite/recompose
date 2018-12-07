import omit from './utils/omit'
import mapProps from './mapProps'
import composeWithDisplayName from './composeWithDisplayName'

const renameProp = (oldName, newName) => {
  const hoc = mapProps(props => ({
    ...omit(props, [oldName]),
    [newName]: props[oldName],
  }))
  return composeWithDisplayName('renameProp', hoc)
}

export default renameProp
