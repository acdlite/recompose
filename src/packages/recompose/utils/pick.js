const pick = (obj, keys) => {
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (Array.isArray(key)) {
      let value = obj
      for (let x = 0; x < key.length; x++) {
        const deepKey = key[x]
        if (!value.hasOwnProperty(deepKey)) {
          value = undefined
          break
        }
        value = value[deepKey]
      }
      result[key.join('\n')] = value
    } else if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

export default pick
