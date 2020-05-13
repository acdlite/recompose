const omit = (obj, keys) => {
  const { ...rest } = obj
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (rest.hasOwnProperty(key)) {
      delete rest[key]
    }
  }
  return rest
}

export default omit
