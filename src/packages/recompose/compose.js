const identity = arg => arg

export default function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)), identity)
}
