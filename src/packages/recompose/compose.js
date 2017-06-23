export default function compose(...funcs) {
  const identity = arg => arg
  return funcs.reduce((a, b) => (...args) => a(b(...args)), identity)
}
