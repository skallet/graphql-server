import {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../flicker.js';


const PhotoSize = new GraphQLObjectType({
  name: 'PhotoSize',
  description: 'Flicker photo size',
  fields: {
    id: globalIdField('photosize'),
    label: {
      type: GraphQLString,
      resolve: (size) => size.label,
    },
    source: {
      type: GraphQLString,
      resolve: (size) => size.source,
    },
    width: {
      type: GraphQLInt,
      resolve: (size) => size.width,
    },
    height: {
      type: GraphQLInt,
      resolve: (size) => size.height,
    },
  },
  interfaces: () => [nodeInterface],
});

export default PhotoSize;
