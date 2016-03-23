import createHelper from './createHelper'

const renderNothing = _ => {
  const Nothing = () => null
  Nothing.displayName = 'Nothing'
  return Nothing
}

export default createHelper(renderNothing, 'renderNothing', false, true)
