import hoistNonReactStatics from 'hoist-non-react-statics'

const hoistStatics = (higherOrderComponent, blacklist) => BaseComponent => {
  const NewComponent = higherOrderComponent(BaseComponent)
  hoistNonReactStatics(NewComponent, BaseComponent, blacklist)
  return NewComponent
}

export default hoistStatics
