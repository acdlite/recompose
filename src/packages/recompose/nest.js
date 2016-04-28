import { internalCreateElement } from './createElement'

const nest = (...Components) => {
  const createElements = Components.map(internalCreateElement)
  const Nest = ({ ...props, children }) =>
    createElements.reduceRight(
      (child, createElement) => createElement(props, child),
      children
    )

  if (process.env.NODE_ENV !== 'production') {
    const getDisplayName = require('./getDisplayName').default
    const displayNames = Components.map(getDisplayName)
    Nest.displayName = `nest(${displayNames.join(', ')})`
  }

  return Nest
}

export default nest
