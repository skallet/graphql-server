import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../flicker.js';

const PhotoOwner = new GraphQLObjectType({
  name: 'PhotoOwner',
  description: 'Flicker photo info',
  fields: {
    id: globalIdField('photoowner'),
    username: {
      type: GraphQLString,
      resolve: (owner) => owner.username && owner.username._content,
    },
    realname: {
      type: GraphQLString,
      resolve: (owner) => owner.realname && owner.realname._content,
    },
    description: {
      type: GraphQLString,
      resolve: (owner) => owner.description && owner.description._content,
    },
    photoCount: {
      type: GraphQLInt,
      resolve: (owner) => owner.photos.count._content,
    },
  },
  interfaces: () => [nodeInterface],
});

export default PhotoOwner;
