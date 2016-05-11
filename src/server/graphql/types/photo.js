import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import {
  nodeInterface,
  getObjectByType,
} from '../flicker.js';

import PhotoInfoType from './photoInfo.js';
import PhotoOwnerType from './photoowner.js';
import PhotoSizeType from './photoSize.js';

const Photo = new GraphQLObjectType({
  name: 'Photo',
  description: 'Flicker photo type',
  fields: {
    id: globalIdField('photo'),
    flickerId: {
      type: GraphQLString,
      resolve: (photo) => photo.id,
    },
    title: {
      type: GraphQLString,
      resolve: (photo) => photo.title,
    },
    info: {
      type: PhotoInfoType,
      resolve: (photo) => getObjectByType('photo', 'getInfo', `photo_id=${photo.id}`),
    },
    owner: {
      type: PhotoOwnerType,
      resolve: (photo) => getObjectByType('people', 'getInfo', `user_id=${photo.owner}`),
    },
    size: {
      type: PhotoSizeType,
      resolve: async (photo) => {
        const data = await getObjectByType('photo', 'getSizes', `photo_id=${photo.id}`);
        return data.size[1];
      },
    },
    source: {
      type: GraphQLString,
      resolve: async (photo) => {
        const data = await getObjectByType('photo', 'getSizes', `photo_id=${photo.id}`);
        return data.size[1].source;
      },
    }
  },
  interfaces: () => [nodeInterface],
});

export default Photo;
