import React, {Component} from 'react';

const DEFAULT_PROMISE_NAME = 'response';

const withPromiseHandler = (WrappedComponent, promiseNames = [DEFAULT_PROMISE_NAME]) => {
  return class extends Component {
    constructor(props) {
      super(props);

      // Immediately provide props to child component
      // Allow careless use of "promised" props
      // I.E. this.props.response.loading won't throw
      this.state = promiseNames.reduce((result, name) => {
        result[name] = {};
        return result;
      }, {});

      this.newPromise = this.newPromise.bind(this);
    }

    updatePromise(name, update) {
      const promise = this.state[name] || {};
      this.setState({
        [name]: {
          ...promise,
          ...update
        }
      });
    }

    createSuccessHandler(name) {
      return data => this.updatePromise(name, { data, loading: false });
    }

    createErrorHandler(name) {
      return error => this.updatePromise(name, { error, loading: false });
    }

    newPromise(promise, name = DEFAULT_PROMISE_NAME) {
      this.updatePromise(name, {loading: true});
      promise
        .then(this.createSuccessHandler(name))
        .catch(this.createErrorHandler(name));
      return promise;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          newPromise={this.newPromise}
        />
      );
    }
  };
}

export default withPromiseHandler;
