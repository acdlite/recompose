import { Component } from 'react'
import { Observable } from 'rx'

const createComponent = propsToVdom =>
  class RxComponent extends Component {
    state = {};

    // Stream of props
    props$ = Observable.create(observer => {
      this.propsObserver = observer
      this.propsObserver.onNext(this.props)
    });

    // Stream of vdom
    vdom$ = propsToVdom(this.props$);

    didReceiveVdom = false;

    // Keep track of whether the component has mounted
    componentHasMounted = false;

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.vdom$.subscribe(
        vdom => {
          this.didReceiveVdom = true
          return !this.componentHasMounted
            ? this.state = { vdom }
            : this.setState({ vdom })
        }
      )
    }

    componentDidMount() {
      this.componentHasMounted = true
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.propsObserver.onNext(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.vdom !== this.state.vdom
    }

    componentWillUnmount() {
      // Clean-up subscription before un-mounting
      this.subscription.dispose()
    }

    render() {
      if (!this.didReceiveVdom) return null
      return this.state.vdom
    }
  }

export default createComponent
