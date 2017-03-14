const pick = (obj, keys) => {
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const val = key
      .split('.')
      .reduce((currVal, keyPart) =>
        currVal && currVal.hasOwnProperty(keyPart) ?
          currVal[keyPart] :
          undefined,
          obj)

    result[key] = val
  }
  return result
}

export default pick
