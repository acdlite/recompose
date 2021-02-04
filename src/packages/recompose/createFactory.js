import { createElement } from 'react'

// NOTE: This is intended to be an internal utility for now, may be
// unit-tested, documented, and exported by the API in the future.
export default function __createFactory(c) {
  // as described in:
  // - https://reactjs.org/blog/2020/02/26/react-v16.13.0.html
  return createElement.bind(null, c)
}
