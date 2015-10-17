import React from 'react';

const createSink = callback => {
  const Sink = props => {
    callback(props);
    return <div />;
  };

  return Sink;
};

export default createSink;
