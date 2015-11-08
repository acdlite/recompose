const getDisplayName = Component => {
  if (typeof Component === 'string') {
    return Component
  }
  return Component.displayName || Component.name || 'Component'
}

export default getDisplayName
