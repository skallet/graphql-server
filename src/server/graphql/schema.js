import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

import config from '../config.js';
import AppType from './types/application.js';
import UserType from './types/user.js';

import {
  createRootListConnection,
  nodeField,
} from './flicker.js';

import { mapToInternalType } from './mapper.js';

import {
  user as UserModel,
} from '../mongo.js';

function getUser() {
  const sessionId = 'static-naive-session';

  return new Promise((resolve) => {
    UserModel
      .findOne({ sessionId })
      .exec((err, user) => {
        if (err) {
          throw err;
        }

        if (!user) {
          const usernameNum = Math.floor(Math.random() * 100 + 1);
          const username = `NaiveUser${usernameNum}`;
          UserModel
            .create({
              sessionId,
              name: username,
              likes: [],
            }, (err, user) => {
              if (err) {
                throw err;
              }

              resolve(user);
            });
        } else {
          resolve(user);
        }
      });
  });
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      application: {
        type: AppType,
        description: 'Aplication informations',
        resolve: () => config,
      },
      me: {
        type: UserType,
        description: 'Username',
        resolve: () => getUser(),
      },
      user: {
        type: UserType,
        args: {
          id: {
            type: GraphQLString,
            description: 'User id',
          },
        },
        description: 'Username',
        resolve: () => getUser(),
      },
      recentPhotos: createRootListConnection(
                      'RecentPhoto',
                      'photo',
                      'getRecent',
                      mapToInternalType('photo'),
                      'photos.photo'
                    ),
      cameraBrands: createRootListConnection(
                      'CameraBrands',
                      'camera',
                      'getBrands',
                      mapToInternalType('camera'),
                      'brands.brand',
                      true
                    ),
      node: nodeField,
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      toggleFollow: {
        type: new GraphQLObjectType({
          name: 'LikeOutputPayload',
          description: 'Like output payload',
          fields: {
            clientMutationId: {
              name: 'Mutation ID',
              type: GraphQLString,
            },
            user: {
              name: 'User',
              type: UserType,
            },
          },
        }),
        args: {
          input: {
            name: 'Like Input',
            type: new GraphQLInputObjectType({
              name: 'LikeInputType',
              description: 'Like toggler',
              fields: {
                user: {
                  name: 'User ID',
                  type: new GraphQLNonNull(GraphQLString),
                },
                photo: {
                  name: 'Photo ID',
                  type: new GraphQLNonNull(GraphQLString),
                },
                clientMutationId: {
                  name: 'Client ID',
                  type: GraphQLString,
                }
              },
            }),
          }
        },
        resolve: (_, { input: { photo, clientMutationId } }) => new Promise((resolve) => {
          getUser()
            .then((user) => {
              const index = user.likes.indexOf(photo);
              if (index >= 0) {
                user.likes.splice(index, 1);
              } else {
                user.likes.push(photo);
              }

              user.save(() => {
                resolve({
                  clientMutationId,
                  user,
                });
              });
            });
        }),
      }
    },
  })
});
