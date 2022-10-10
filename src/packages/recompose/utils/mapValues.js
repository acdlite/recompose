const mapValues = (obj, func) => {
  const result = {}
  // TODO: no-unused-vars seems to trigger a issue in recent eslint versions
  /* eslint-disable no-restricted-syntax, no-unused-vars */
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = func(obj[key], key)
    }
  }
  // TODO: see above comment regarding no-unused-vars
  /* eslint-enable no-restricted-syntax, no-unused-vars */
  return result
}

export default mapValues
