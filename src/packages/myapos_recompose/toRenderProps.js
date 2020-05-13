export default function toRenderProps(hoc) {
  const RenderPropsComponent = props => props.children(props)
  return hoc(RenderPropsComponent)
}
