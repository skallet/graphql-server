import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLList,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../flicker.js';

const User = new GraphQLObjectType({
  name: 'User',
  description: '',
  fields: {
    id: globalIdField('usertype'),
    name: {
      type: GraphQLString,
      resolve: (user) => user.name,
    },
    likes: {
      type: new GraphQLList(GraphQLString),
      resolve: (user) => user.likes,
    }
  },
  interfaces: () => [nodeInterface],
});

export default User;
