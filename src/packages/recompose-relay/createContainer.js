import Relay from 'react-relay';
import curry from 'lodash/function/curry';
import toClass from 'recompose/toClass';

const createContainer = curry((options, BaseComponent) => (
  Relay.createContainer(toClass(BaseComponent), options)
));

export default createContainer;
