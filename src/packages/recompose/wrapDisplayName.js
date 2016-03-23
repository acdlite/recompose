import getDisplayName from './getDisplayName'

const wrapDisplayName = (BaseComponent, hocName) =>
  `${hocName}(${getDisplayName(BaseComponent)})`

export default wrapDisplayName
