import depthEqual from './depthEqual'

export default function shallowEqual(objA, objB) {
  return depthEqual(objA, objB, 1)
}
