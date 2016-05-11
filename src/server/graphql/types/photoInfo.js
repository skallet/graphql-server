import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../flicker.js';


const PhotoInfo = new GraphQLObjectType({
  name: 'PhotoInfo',
  description: 'Flicker photo info',
  fields: {
    id: globalIdField('photoinfo'),
    url: {
      type: GraphQLString,
      resolve: (info) => info.urls.url[0]._content,
    },
    isPublic: {
      type: GraphQLBoolean,
      resolve: (info) => info.visibility.ispublic,
    },
  },
  interfaces: () => [nodeInterface],
});

export default PhotoInfo;
