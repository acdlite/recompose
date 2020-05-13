/* @flow */
import * as React from 'react'
import { compose, withProps } from '../..'
import type { HOC } from '../..'

// Example of very dirty written fetcher enhancer
function fetcher<Response: {}, Base: {}>(
  dest: string,
  nullRespType: ?Response
): HOC<{ ...$Exact<Base>, data?: Response }, Base> {
  return BaseComponent =>
    class Fetcher extends React.Component<Base, { data?: Response }> {
      state = { data: undefined }
      componentDidMount() {
        fetch(dest)
          .then(r => r.json())
          .then((data: Response) => this.setState({ data }))
      }
      render() {
        return <BaseComponent {...this.props} {...this.state} />
      }
    }
}
// Enhanced Component props type
type EnhancedCompProps = { b: number }
// response type
type FetchResponseType = { hello: string, world: number }

// Now you can use it, let's check
const enhancer: HOC<*, EnhancedCompProps> = compose(
  // pass response type via typed null
  fetcher('http://endpoint.ep', (null: ?FetchResponseType)),
  // see here fully typed data
  withProps(({ data }) => {
    if (data !== undefined) {
      return {
        h: (data.hello: string),
        // $ExpectError
        hE: (data.hello: number),
      }
    }

    return {}
  })
)
