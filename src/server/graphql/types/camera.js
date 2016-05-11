import {
    GraphQLString,
    GraphQLObjectType,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../flicker.js';

const Camera = new GraphQLObjectType({
  name: 'Camera',
  description: 'Flicker camera brands',
  fields: {
    id: globalIdField('camera'),
    name: {
      type: GraphQLString,
      resolve: (info) => info.name,
    },
  },
  interfaces: () => [nodeInterface],
});

export default Camera;
