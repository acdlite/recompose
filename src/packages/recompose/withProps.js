import mapProps from './mapProps'
import composeWithDisplayName from './composeWithDisplayName'

const withProps = input => {
  const hoc = mapProps(props => ({
    ...props,
    ...(typeof input === 'function' ? input(props) : input),
  }))
  return composeWithDisplayName('withProps', hoc)
}

export default withProps
