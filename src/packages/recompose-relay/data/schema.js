import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import { get } from 'lodash-fp';

import { CHARACTER, RELATIONSHIP } from './constants';
import { getCharacter, getCharacterByName } from './characters';
import { createNode, getNodeType } from './nodeUtils';

let characterType;
let relationshipType;

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    return type === CHARACTER
      ? createNode(CHARACTER, getCharacter(id))
      : null;
  },
  obj => {
    const nodeType = getNodeType(obj);
    return nodeType === CHARACTER
      ? characterType
      : null;
  }
);

characterType = new GraphQLObjectType({
  name: CHARACTER,
  fields: () => ({
    id: globalIdField(CHARACTER),

    name: {
      type: GraphQLString,
      resolve: get('name')
    },

    house: {
      type: GraphQLString,
      resolve: get('house')
    },

    relationships: {
      type: new GraphQLList(relationshipType),
      resolve: get('relationships')
    }
  }),
  interfaces: [nodeInterface]
});

relationshipType = new GraphQLObjectType({
  name: RELATIONSHIP,
  fields: () => ({
    kind: {
      type: GraphQLString,
      resolve: get('kind')
    },

    character: {
      type: characterType,
      resolve: relationship => (
        createNode(CHARACTER, getCharacter(relationship.characterId))
      )
    }
  })
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,

    tyrion: {
      type: characterType,
      resolve: () => createNode(CHARACTER, getCharacterByName('Tyrion'))
    }
  })
});

export default new GraphQLSchema({
  query: queryType
});
