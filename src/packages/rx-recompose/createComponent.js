import { Component } from 'react'

const createComponent = propsToVdom =>
  class RxComponent extends Component {
    state = {}

    // Stream of props
    props$ = new Observable(observer => {
      this.propsObserver = observer
      this.propsObserver.next(this.props)
    })

    // Stream of vdom
    vdom$ = propsToVdom(this.props$)

    // Keep track of whether the component has mounted
    componentHasMounted = false

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.vdom$.subscribe({
        next: vdom =>
          !this.componentHasMounted
            ? this.state = { vdom }
            : this.setState({ vdom })
      })
    }

    componentDidMount() {
      this.componentHasMounted = true
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.propsObserver.next(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.vdom !== this.state.vdom
    }

    componentWillUnmount() {
      // Clean-up subscription before un-mounting
      this.subscription.unsubscribe()
    }

    render() {
      return this.state.vdom
    }
  }

export default createComponent
