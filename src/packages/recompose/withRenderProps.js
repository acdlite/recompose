export default function withRenderProps(hoc) {
  const RenderPropsComponent = props => props.children(props)
  return hoc(RenderPropsComponent)
}
