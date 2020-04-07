const mapValues = (obj, func) => Object.enteties(obj)
  .reduce((acc,[key,val])=>{
    if (obj.hasOwnProperty(key)) {
      acc[key] = func(val, key)
    }
    return acc;
  },{});

export default mapValues
