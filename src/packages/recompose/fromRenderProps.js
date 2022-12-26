import React from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const fromRenderProps = (
  RenderPropsComponent,
  propsMapper,
  renderPropName = 'children'
) =>
  composeWithDisplayName('fromRenderProps', BaseComponent => {
    const baseFactory = React.createFactory(BaseComponent)
    const renderPropsFactory = React.createFactory(RenderPropsComponent)

    return ownerProps =>
      renderPropsFactory({
        [renderPropName]: (...props) =>
          baseFactory({ ...ownerProps, ...propsMapper(...props) }),
      })
  })

export default fromRenderProps
