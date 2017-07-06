import wrapDisplayName from './wrapDisplayName'
import setDisplayName from './setDisplayName'
import withProps from './withProps'

const withStyles = styles => {
  const hoc = withProps(props => ({
    styles: (typeof styles === 'function' ? styles(props) : styles)
  }))
  if (process.env.NODE_ENV !== 'production') {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, 'withStyles'))(
        hoc(BaseComponent)
      )
  }
  return hoc
}

export default withStyles
