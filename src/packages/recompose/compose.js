export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const innerFunc = funcs[funcs.length - 1]
  const restFuncs = funcs.slice(0, -1)
  const reducer = (result, fn) => fn(result)

  return function composed(...args) {
    return restFuncs.reduceRight(reducer, innerFunc(...args))
  }
}
