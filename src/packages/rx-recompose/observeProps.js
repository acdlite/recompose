import { Component } from 'react'
import curry from 'lodash/function/curry'
import createElement from 'recompose/createElement'
import wrapDisplayName from 'recompose/wrapDisplayName'
import { Subject } from 'rx'

const observeProps = (propsSequenceMapper, BaseComponent) => (
  class extends Component {
    static displayName = wrapDisplayName(BaseComponent, 'observeProps')

    state = {}

    // Subject that receives props from owner
    ownerProps$ = new Subject()

    // Sequence of child props
    childProps$ = propsSequenceMapper(this.ownerProps$.startWith(this.props))

    // Keep track of whether the component has mounted
    componentHasMounted = false

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.childProps$.subscribe(
        childProps =>
          !this.componentHasMounted
            ? this.state = { childProps }
            : this.setState({ childProps })
      )
    }

    componentDidMount() {
      this.componentHasMounted = true
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.ownerProps$.onNext(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.childProps !== this.state.childProps
    }

    componentWillUnmount() {
      // Clean-up subscription before un-mounting
      this.subscription.dispose()
    }

    render() {
      return createElement(BaseComponent, this.state.childProps)
    }
  }
)

export default curry(observeProps)
