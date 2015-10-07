import curry from 'lodash/function/curry';
import getDisplayName from './getDisplayName';

const wrapDisplayName = (BaseComponent, hocName) => (
  `${hocName}(${getDisplayName(BaseComponent)})`
);

export default curry(wrapDisplayName);
