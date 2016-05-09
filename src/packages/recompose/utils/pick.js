const pick = (obj, keys) =>
  keys.reduce((result, key) => {
    result[key] = obj[key]
    return result
  }, {})

export default pick
