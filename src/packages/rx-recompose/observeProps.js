import { Component } from 'react'
import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'

const observeProps = (propsSequenceMapper, BaseComponent) => (
  class extends Component {
    state = {}

    // Stream of owner props
    ownerProps$ = new Observable(observer => {
      this.ownerPropsObserver = observer
      this.ownerPropsObserver.next(this.props)
      return () => {}
    })

    // Stream of child props
    childProps$ = propsSequenceMapper(this.ownerProps$)

    // Keep track of whether the component has mounted
    componentHasMounted = false

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.childProps$.subscribe({
        next: childProps =>
          !this.componentHasMounted
            ? this.state = { childProps }
            : this.setState({ childProps })
      })
    }

    componentDidMount() {
      this.componentHasMounted = true
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.ownerPropsObserver.next(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.childProps !== this.state.childProps
    }

    componentWillUnmount() {
      // Clean-up subscription before un-mounting
      this.subscription.unsubscribe()
    }

    render() {
      return createElement(BaseComponent, this.state.childProps)
    }
  }
)

export default createHelper(observeProps, 'observeProps')
