import { Component } from 'react'
import { createChangeEmitter } from 'change-emitter'

const componentFromStream = propsToVdom =>
  class ComponentFromStream extends Component {
    state = {};

    propsEmitter = createChangeEmitter();

    // Stream of props
    props$ = Observable.create(observer =>
      this.propsEmitter.listen(props => observer.next(props))
    );

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
          if (!this.componentHasMounted) {
            this.state = { vdom }
          } else {
            this.setState({ vdom })
          }
        }
      )

      this.propsEmitter.emit(this.props)
    }

    componentDidMount() {
      this.componentHasMounted = true
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.propsEmitter.emit(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.vdom !== this.state.vdom
    }

    componentWillUnmount() {
      // Clean-up subscription before un-mounting
      this.subscription.unsubscribe()
    }

    render() {
      if (!this.didReceiveVdom) return null
      return this.state.vdom
    }
  }

export default componentFromStream
