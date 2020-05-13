const isClassComponent = Component =>
  Boolean(
    Component &&
      Component.prototype &&
      typeof Component.prototype.render === 'function'
  )

export default isClassComponent
