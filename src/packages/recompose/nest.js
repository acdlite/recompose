import createElement from './createElement'

const nest = (...Components) => {
  const Nest = ({ ...props, children }) =>
    Components.reduceRight(
      (child, Component) => createElement(Component, props, child),
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
