const compose = (...funcs) =>
  funcs.reduce((a, b) => (...args) => b(a(...args)), arg => arg)

export default compose
