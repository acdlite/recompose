import createEagerFactory from './createEagerFactory'

const nest = (...Components) => {
  const factories = Components.map(createEagerFactory)
  const Nest = ({ ...props, children }) =>
    factories.reduceRight(
      (child, factory) => factory(props, child),
      children
    )

  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable global-require */
    const getDisplayName = require('./getDisplayName').default
    /* eslint-enable global-require */
    const displayNames = Components.map(getDisplayName)
    Nest.displayName = `nest(${displayNames.join(', ')})`
  }

  return Nest
}

export default nest
