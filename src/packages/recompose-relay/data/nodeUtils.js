import { NODE_TYPE } from './constants';

export function createNode(nodeType, object) {
  if (!object) return null;

  return {
    ...object,
    [NODE_TYPE]: nodeType
  };
}

export function getNodeType(node) {
  return node[NODE_TYPE];
}
