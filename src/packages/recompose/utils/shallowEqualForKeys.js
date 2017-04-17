const shallowEqualForKeys = (keys, a, b) =>
  a === b || keys.every(key => a[key] === b[key])

export default shallowEqualForKeys
