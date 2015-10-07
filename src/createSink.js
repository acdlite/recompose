import React from 'react';

const createSink = callback => class Sink extends React.Component {
  constructor(props, context) {
    super(props, context);
    callback(props);
  }

  componentWillReceiveProps(nextProps) {
    callback(nextProps);
  }

  render() {
    return null;
  }
};

export default createSink;
