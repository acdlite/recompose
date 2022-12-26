import createFactory from './utils/createFactory'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const fromRenderProps = (
  RenderPropsComponent,
  propsMapper,
  renderPropName = 'children'
) => BaseComponent => {
  const baseFactory = createFactory(BaseComponent)
  const renderPropsFactory = createFactory(RenderPropsComponent)

  const FromRenderProps = ownerProps =>
    renderPropsFactory({
      [renderPropName]: (...props) =>
        baseFactory({ ...ownerProps, ...propsMapper(...props) }),
    })

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'fromRenderProps'))(
      FromRenderProps
    )
  }

  return FromRenderProps
}

export default fromRenderProps
